from immudb.client import ImmudbClient

ic=ImmudbClient()
ic.login(username="immudb",username="immudb")


# Let's define or first key/value pair in a canonical fashion
key="Hello".encode('utf8')
value="Immutable world!".encode('utf8')

# We now store the key/value pair in immudb
ic.set(key,value)

# And then, we read back the value:
readback=ic.get(key)
saved_value=readback.value.decode('utf8')
print("Hello",saved_value)

# you also have the transaction id of the set that inserted the value.
# Try running multiple times this example to see it increasing
print("The set was transaction number ",readback.tx)
