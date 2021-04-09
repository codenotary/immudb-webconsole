---
title: Logging into immudb
sort: 0
code: login
active: true
---

Before any operations can be run by immuclient, it is necessary to authenticate against the running immudb server.

When immudb is first run, it is ready to use immediately with the default database and credentials:

- Database name: **defaultdb**
- User: **immudb**
- Password: **immudb**

In this example we import the client class from immudb-py package, establish a connection with the database, and then login with default credentials.