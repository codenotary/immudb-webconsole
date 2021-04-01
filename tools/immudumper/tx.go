package main

import (
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"github.com/codenotary/immudb/pkg/api/schema"
)

type tx_metadata struct {
	Id       uint64 `json:"id"`          // transaction id
	Ts       int64  `json:"timestamp"`   // timestamp (epoch)
	Eh       string `json:"elementhash"` // hash of all items in the tree
	Alh      string `json:"prevroot"`    // previous root
	nentries int32
	blTxId   uint64
	blRoot   []byte
}
type tx_entry struct {
	Key  string `json:"key"`
	Hash string `json:"hash"`
}

type txj struct {
	Metadata tx_metadata `json:"metadata"`
	Entries  []tx_entry  `json:"entries"`
	Root     string      `json:"root"`
	Htree    string      `json:"htree,omitempty"`
	Hchild   []string    `json:"hchild,omitempty"`
}

func buildStruct(tx *schema.Tx) txj {
	md := tx_metadata{
		Id:       tx.Metadata.Id,
		Ts:       tx.Metadata.Ts,
		Eh:       hex.EncodeToString(tx.Metadata.EH),
		Alh:      hex.EncodeToString(tx.Metadata.PrevAlh),
		nentries: tx.Metadata.Nentries,
		blTxId:   tx.Metadata.BlTxId,
		blRoot:   tx.Metadata.BlRoot,
	}
	entries := make([]tx_entry, tx.Metadata.Nentries)
	for i, v := range tx.Entries {
		entries[i].Key = string(v.Key)
		entries[i].Hash = hex.EncodeToString(v.HValue)
	}
	root := md.CalcAlh()
	htree := CalcHtree(root)
	return txj{
		Metadata: md,
		Entries:  entries,
		Root:     root,
		Htree:    htree,
	}
}

const txIDSize = 8
const tsSize = 8

// Alh calculates the Accumulative Linear Hash up to this transaction
// Alh is calculated as hash(txID + prevAlh + hash(ts + nentries + eH + blTxID + blRoot))
// Inner hash is calculated so to reduce the length of linear proofs
func (tx *tx_metadata) CalcAlh() string {
	innerhash := tx.calcInnerHash()
	txalh, _ := hex.DecodeString(tx.Alh)
	var bi [txIDSize + 2*sha256.Size]byte
	binary.BigEndian.PutUint64(bi[:], tx.Id)
	copy(bi[txIDSize:], txalh[:])
	copy(bi[txIDSize+sha256.Size:], innerhash[:]) // hash(ts + nentries + eH + blTxID + blRoot)
	alh := sha256.Sum256(bi[:])                   // hash(txID + prevAlh + innerHash)
	return hex.EncodeToString(alh[:])
}

func (tx *tx_metadata) calcInnerHash() []byte {
	var bj [tsSize + 4 + sha256.Size + txIDSize + sha256.Size]byte
	binary.BigEndian.PutUint64(bj[:], uint64(tx.Ts))
	binary.BigEndian.PutUint32(bj[tsSize:], uint32(tx.nentries))
	eh, _ := hex.DecodeString(tx.Eh)
	copy(bj[tsSize+4:], eh[:])
	binary.BigEndian.PutUint64(bj[tsSize+4+sha256.Size:], tx.blTxId)
	copy(bj[tsSize+4+sha256.Size+txIDSize:], tx.blRoot[:])
	ih := sha256.Sum256(bj[:]) // hash(ts + nentries + eH + blTxID + blRoot)
	return ih[:]
}
