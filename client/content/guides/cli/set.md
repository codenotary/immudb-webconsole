---
title: Your first transaction
sort: 10
live: true
active: true
---

In the past example, we have seen the use of `immuclient login immudb` to login to the default database.

If you want to run several commands with immuclient, you can also drop into the interactive shell by running `immuclient`:

<guide-code language="bash" :data="[{ prompt: 'bash-5.1#', code: 'immuclient' }]" runnable></guide-code>

You should now see that the prompt in the live environment has changed from `bash-5.1#` to `immuclient>`. While in the immuclient shell, you do not need to prefix your commands with `immuclient`.

Try using the immuclient shell, and log in if you haven't already. We should now be ready to perform our first transaction:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'set balance 100' }]" runnable></guide-code>

immudb should now contain a transaction setting the key `balance` to the value `100`. If you look at the Merkle tree, you should see a new leaf node has been created due to this set operation.

![](/images/cli/set1.gif)