---
title: Logging in with immuclient
sort: 0
live: true
active: true
---

Before any operations can be run by immuclient, it is necessary to authenticate against the running immudb server.

When immudb is first run, it is ready to use immediately with the default database and credentials:

- Database name: **defaultdb**
- User: **immudb**
- Password: **immudb**

In the live environment, `immudb -d` has been executed to run immudb in a detached state in the background. Let's try using immuclient to log into the default database!

<guide-code language="bash" :data="[{ prompt: 'bash-5.1#', code: 'immuclient login immudb' }]" runnable></guide-code>

You should be prompted for a password, and once you enter it, you should see a message telling you that you are successfully logged in.