package main

import (
	"archive/tar"
	"compress/gzip"
	"context"
	"io"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func extractTarball(tarball io.Reader, dir string) error {
	uncompressedStream, err := gzip.NewReader(tarball)
	if err != nil {
		log.Printf("Error while extracting tarball: %s", err.Error())
		return err
	}

	tarReader := tar.NewReader(uncompressedStream)

	for true {
		header, err := tarReader.Next()

		if err == io.EOF {
			break
		}

		if err != nil {
			log.Printf("Error while extracting tarball: %s", err.Error())
			return err
		}

		switch header.Typeflag {
		case tar.TypeDir:
			// 			log.Printf("Extracting dir %s", path.Join(dir, header.Name))
			if err := os.Mkdir(path.Join(dir, header.Name), 0755); err != nil {
				log.Printf("Error while extracting tarball: %s", err.Error())
				return err
			}
		case tar.TypeReg:
			fname := path.Join(dir, header.Name)
			// 			log.Printf("Extracting file %s", fname)
			err = os.MkdirAll(path.Dir(fname), 0755)
			if err != nil {
				log.Printf("Error while extracting tarball: %s", err.Error())
				return err
			}
			outFile, err := os.Create(fname)
			if err != nil {
				outFile.Close()
				log.Printf("Error while extracting tarball: %s", err.Error())
				return err
			}
			if _, err := io.Copy(outFile, tarReader); err != nil {
				outFile.Close()
				log.Printf("Error while extracting tarball: %s", err.Error())
				return err
			}
			outFile.Close()
		default:
			log.Printf("Error while extracting tarball:uknown type: %s in %s",
				header.Typeflag,
				header.Name)
		}
	}
	return nil
}

func doTarball(ctx context.Context, rootpath, src, dst string) error {
	// log.Printf("Compressing %s [%s] to %s", src,rootpath,dst)
	// Create output file
	out, err := os.Create(dst)
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return err
	}
	defer out.Close()
	gw := gzip.NewWriter(out)
	defer gw.Close()
	tw := tar.NewWriter(gw)
	defer tw.Close()
	// Iterate over files and add them to the tar archive
	err = filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if err = ctx.Err(); err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		if err = addToArchive(tw, path, rootpath); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Printf("Error writing archive: %s", err.Error())
		return err
	}
	return nil
}

func addToArchive(tw *tar.Writer, filename string, stripdir string) error {
	// log.Printf("Adding %s", filename)
	// Open the file which will be written into the archive
	file, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	// Get FileInfo about our file providing file size, mode, etc.
	info, err := file.Stat()
	if err != nil {
		return err
	}

	// Create a tar Header from the FileInfo data
	header, err := tar.FileInfoHeader(info, info.Name())
	if err != nil {
		return err
	}

	// Use full path as name (FileInfoHeader only takes the basename)
	// If we don't do this the directory strucuture would
	// not be preserved
	// https://golang.org/src/archive/tar/common.go?#L626
	if stripdir != "" && strings.HasPrefix(filename, stripdir) {
		header.Name = filename[len(stripdir):]
	} else {
		header.Name = filename
	}

	// Write file header to the tar archive
	err = tw.WriteHeader(header)
	if err != nil {
		return err
	}

	// Copy file content to tar archive
	_, err = io.Copy(tw, file)
	if err != nil {
		return err
	}
	return nil
}
