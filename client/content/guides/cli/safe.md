---
title: Safe operations
sort: 30
live: true
active: true
---

In the past examples, we have seen the use of set and get, as well as a demonstration of immutability using the history command.

The set and get commands have "safe" counterparts, safeset and safeget. These commands use hashing to verify the Merkle tree's integrity.

The following example will work best by viewing the Merkle tree in the preview below. Let's run the following:

```
immuclient> safeset 1 baz
```

If there are existing transactions, then the safeset command will index all transactions. You should see that `verified` is set to true. Let's run the following:

```
immuclient> safeget 1
```

The `verified` boolean should also be true here.