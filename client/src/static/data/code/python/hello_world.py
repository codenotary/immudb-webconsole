# Import, instantiate, and login (as per previous example)
from immudb.client import ImmudbClient
ic = ImmudbClient()
ic.login(username="immudb", password="immudb")

# Let's define our first key/value pair in a canonical fashion:
key = "Hello".encode('utf8')
value = "Immutable world!".encode('utf8')

# We now store the key/value pair in immudb:
ic.set(key, value)

# And then, we read back the value:
readback = ic.get(key)
saved_value = readback.value.decode('utf8')
print(key, saved_value)

# You also have the transaction id of the set that inserted the value.
# Try running this example multiple times to see it increasing!
print("The transaction number was ",readback.tx)
