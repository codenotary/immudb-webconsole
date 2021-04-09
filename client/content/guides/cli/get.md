---
title: What immutability means
sort: 20
live: true
active: true
---

In the past example, we have seen how to use immuclient to set a key-value pair in the database. immudb should currently contain a transaction setting the key `1` to the value `foo`.

Now, let's try overwriting this key with a different value:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'set 1 bar' }]"></guide-code>


immudb should now contain a transaction setting the key `1` to the value `bar`.

At any point, we are free to retrieve the data from immudb for any given key by using the get command:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'get 1' }]"></guide-code>


This should show us the latest transaction involving the given key, and its last set value. However, that is not all we can do! The value provided by immudb is that **we can view the complete history of changes** to any given key. Let's view the history of our transactions so far:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'history 1' }]"></guide-code>

You should see both of our transactions returned-- the first setting a value of `foo`, and the second setting a value of `bar`.