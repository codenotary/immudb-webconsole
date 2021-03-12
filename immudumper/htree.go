package main

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"math/bits"
)

var ErrIllegalArguments = errors.New("illegal arguments")
var ErrMaxWidthExceeded = errors.New("max width exceeded")

const LeafPrefix = byte(0)
const NodePrefix = byte(1)

type HTree struct {
	levels   [][][sha256.Size]byte
	maxWidth int
	width    int
	root     [sha256.Size]byte
}

func NewHTree(maxWidth int) (*HTree, error) {
	if maxWidth < 1 {
		return nil, ErrIllegalArguments
	}

	lw := 1
	for lw < maxWidth {
		lw = lw << 1
	}

	height := bits.Len64(uint64(maxWidth-1)) + 1

	levels := make([][][sha256.Size]byte, height)
	for l := 0; l < height; l++ {
		levels[l] = make([][sha256.Size]byte, lw>>l)
	}

	return &HTree{
		levels:   levels,
		maxWidth: maxWidth,
	}, nil
}

func (t *HTree) BuildWith(digests [][sha256.Size]byte) error {
	if len(digests) > t.maxWidth {
		return ErrMaxWidthExceeded
	}

	if len(digests) == 0 {
		return ErrIllegalArguments
	}

	for i, d := range digests {
		leaf := [1 + sha256.Size]byte{LeafPrefix}
		copy(leaf[1:], d[:])
		t.levels[0][i] = sha256.Sum256(leaf[:])
	}

	l := 0
	w := len(digests)

	for w > 1 {
		b := [1 + 2*sha256.Size]byte{NodePrefix}

		wn := 0

		for i := 0; i+1 < w; i += 2 {
			copy(b[1:], t.levels[l][i][:])
			copy(b[1+sha256.Size:], t.levels[l][i+1][:])
			t.levels[l+1][wn] = sha256.Sum256(b[:])
			wn++
		}

		if w%2 == 1 {
			t.levels[l+1][wn] = t.levels[l][w-1]
			wn++
		}

		l++
		w = wn
	}

	t.width = len(digests)
	t.root = t.levels[l][0]

	return nil
}

func CalcHtree(salh string) string {
	balh, _ := hex.DecodeString(salh)
	leaf := [1 + sha256.Size]byte{LeafPrefix}
	copy(leaf[1:], balh[:])
	ht := sha256.Sum256(leaf[:])
	return hex.EncodeToString(ht[:])
}
