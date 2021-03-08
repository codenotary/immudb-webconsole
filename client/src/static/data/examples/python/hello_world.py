#!/usr/bin/env python3

from immudb.client import ImmudbClient

ic=ImmudbClient()
ic.login("immudb","immudb")

key="Hello".encode('utf8')
value="Immutable world!".encode('utf8')

# set a key/value pair
ic.set(key,value)

# reads back the value
readback=ic.get(key)
saved_value=readback.value.decode('utf8')
print("Hello",saved_value)

# you have the transaction id of the set that inserted the value
print("The set was transaction number ",readback.tx)
