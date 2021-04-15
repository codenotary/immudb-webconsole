---
title: What immutability means
sort: 20
live: true
active: true
---

In the past example, we have seen how to use immuclient to set a key-value pair in the database. immudb should currently contain a transaction setting the key `balance` to the value `100`.

Now, let's try overwriting this key with a different value:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'set balance 9000' }]" runnable></guide-code>

immudb should now contain a transaction setting the key `balance` to the value `9000`. If you look at the Merkle tree, you should see a new leaf node has been created due to this set operation, and the tree has been rebalanced. Every time you perform a new transaction, a new leaf node will be created and the tree will be rebalanced.

![](/images/cli/set2.gif)

At any point, we are free to retrieve the data from immudb for any given key by using the get command:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'get balance' }]" runnable></guide-code>

This should show us the latest transaction involving the given key, and its last set value. However, that is not all we can do! The value provided by immudb is that **we can view the complete history of changes** to any given key. Let's view the history of our transactions so far:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'history balance' }]" runnable></guide-code>

You should see both of our transactions returned-- the first setting a value of `100`, and the second setting a value of `9000`.