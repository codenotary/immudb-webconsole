package main

import (
	"archive/tar"
	"compress/gzip"
	"context"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"

	// 	"github.com/docker/docker/pkg/stdcopy"
	"encoding/json"
	"log"
	"bytes"
	"io/ioutil"
	"os"
	"path"
	// 	"bufio"
	// 	"time"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"
)

type runRequest struct {
	Code   string `json:"code"`
	Immudb []byte `json:"immudb"`
}
type runResponse struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
	Immdub []byte `json:"immudb"`
}

// runCode ...
// @id runCode
// @tags info
// @summary Show software version
// @accept application/json
// @param request body runRequest true "Run request"
// @produce application/json
// @success 200 {object} runResponse
// @failure 400
// @failure 500
// @router /exec/run [post]
func runCode(w http.ResponseWriter, r *http.Request) {
	var req runRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error: %s", err.Error())
		return
	}
	cli, err := client.NewClientWithOpts(client.WithAPIVersionNegotiation())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	defer cli.Close()
	// create ephimeral volume
	dir, err := ioutil.TempDir("/var/tmp", "ephvolume:")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	defer os.RemoveAll(dir)
	// put code into ephimeral volume
	err = ioutil.WriteFile(path.Join(dir, "runme.py"), []byte(req.Code), 0644)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error: %s", err.Error())
		return
	}
	// extract immudb state
	if len(req.Immudb)>0 {
		err = extractTarball(bytes.NewReader(req.Immudb),dir)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Error: %s", err.Error())
			return
		}
        }
	// launch the container
	err = runContainer(cli, dir)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	jresponse, err := readback(dir)
	if err != nil {
		log.Printf("Error while reading response: %s", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, _ := json.Marshal(jresponse)
	fmt.Fprintf(w, string(response)+"\n")
}

func runContainer(cli *client.Client, dir string) (err error) {
	ctx := context.Background()
	resp, err := cli.ContainerCreate(ctx,
		&container.Config{Image: "player-py:latest", Tty: false},
		&container.HostConfig{
			Mounts: []mount.Mount{
				{Type: mount.TypeBind, Source: dir, Target: "/tmp"},
			},
		},
		nil,      //net config
		nil,      // platform
		"Mennea") // name
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	defer cli.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{})
	err = cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{})
	if err != nil {
		log.Printf("Error: %s", err.Error())
		return
	}
	statusCh, errCh := cli.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	select {
	case err = <-errCh:
		if err != nil {
			log.Printf("Error: %s", err.Error())
			return
		}
	case <-statusCh:
	}
	err = doTarball(ctx, dir, path.Join(dir, "data"), path.Join(dir, "data.tar.gz"))
	if err != nil {
		log.Printf("Error while extracting immudb data: %s", err.Error())
		return
	}
	
	return
}


func readback(dir string) (response runResponse, err error) {
	stdout, err := ioutil.ReadFile(path.Join(dir, "stdout"))
	if err!=nil {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	stderr, err := ioutil.ReadFile(path.Join(dir, "stderr"))
	if err!=nil {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	immudb, err := ioutil.ReadFile(path.Join(dir, "data.tar.gz"))
	if err!=nil {
		log.Printf("Error while reding immudb data archive: %s", err.Error())
		return
	}
	response = runResponse{string(stdout), string(stderr), immudb}
	return
}

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
				log.Printf("Extracting dir %s",path.Join(dir,header.Name))
				if err := os.Mkdir(path.Join(dir,header.Name), 0755); err != nil {
					log.Printf("Error while extracting tarball: %s", err.Error())
					return err
				}
			case tar.TypeReg:
				fname := path.Join(dir,header.Name)
				log.Printf("Extracting file %s",fname)
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
