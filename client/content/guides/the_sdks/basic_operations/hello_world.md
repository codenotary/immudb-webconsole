---
title: hello world
sort: 0
code: hello_world
active: true
---

In this example, we start actually using immudb. Immudb at its core is a key value store, so the first operation we will learn is to store, and then read back, a key/value pair. Data is stored in immudb as binary string, so regular python string must be encoded before writing, and decoded after reading