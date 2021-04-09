---
title: Setting and getting
sort: 10
code: hello_world
active: true
---

In this example, we start actually using immudb. immudb at its core is a key-value store, so the first operation we will learn is to store and then read back a key-value pair. Data is stored in immudb as a binary string, so regular Python strings must first be encoded before writing and decoded after reading.