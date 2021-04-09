---
title: Your first transaction
sort: 10
live: true
active: true
---

In the past example, we have seen the use of `immuclient login immudb` to login to the default database. If you want to run several commands with immuclient, you can also drop into the interactive shell by running `immuclient`:

```bash
immuclient
```

You should now see that the prompt in the live environment has changed from `bash-5.1#` to `immuclient>`. While in the immuclient shell, you do not need to prefix your commands with `immuclient`. For example, the following are equivalent:

```
bash-5.1# immuclient login immudb
```

```
bash-5.1# immuclient
immuclient> login immudb
```

Try using the immuclient shell, and log in if you haven't already. We should now be ready to perform our first transaction:

```
immuclient> set 1 foo
```

immudb should now contain a transaction setting the key `1` to the value `foo`.