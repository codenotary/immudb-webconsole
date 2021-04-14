---
title: Your first transaction
sort: 10
live: true
active: true
---

In the past example, we have seen the use of `immuclient login immudb` to login to the default database. If you want to run several commands with immuclient, you can also drop into the interactive shell by running `immuclient`:

<guide-code language="bash" :data="[{ prompt: 'bash-5.1#', code: 'immuclient' }]" runnable></guide-code>

You should now see that the prompt in the live environment has changed from `bash-5.1#` to `immuclient>`. While in the immuclient shell, you do not need to prefix your commands with `immuclient`. For example, the following are equivalent:

<guide-code language="bash" :data="[{ prompt: 'bash-5.1#', code: 'immuclient login immudb' }]" runnable></guide-code>

<guide-code language="bash" :data="[{ prompt: 'bash-5.1#', code: 'immuclient' }, { prompt: 'immuclient', code: 'login immudb' }]" runnable></guide-code>

Try using the immuclient shell, and log in if you haven't already. We should now be ready to perform our first transaction:

<guide-code language="bash" :data="[{ prompt: 'immuclient>', code: 'set 1 foo' }]" runnable></guide-code>

immudb should now contain a transaction setting the key `1` to the value `foo`.