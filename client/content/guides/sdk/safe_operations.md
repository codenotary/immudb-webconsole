---
title: Safe operations
sort: 20
code: safe_operations
active: true
---

There are many stores out there that can handle key/values. What makes immudb unique is that it stores values immutably.

Once a key/value pair is stored, you have cryptographic proof that that value, in that transaction, is not going to be tampered. Nobody can change the value stored and be undetected. To show this, we will use the **verified** versions of the get and set functions we just encoutered.

A **verifiedSet** stores a values in the database, while checking for the mathematical consistency with the previous database state, while a **verifiedGet** fetches a value from the database, checking that the value we get is mathematically consistent with the database state