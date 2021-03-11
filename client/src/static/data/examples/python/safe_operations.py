from immudb.client import ImmudbClient

ic=ImmudbClient()
ic.login(username="immudb",password="immudb")

key="a_very_important_key".encode('utf8')
value="a_very_important_value".encode('utf8')

# let's insert the value in the DB and check
# if it was correctly inserted
response=ic.verifiedSet(key,value)

# If database state after the insertion is consistent with the state we had before,
# and the new value hash is included in new state, the transaction is verified.
assert response.verified==True

print("Key inserted (and verified) with index",response.id)

# Now we read back the value we just stored
readback=ic.verifiedGet(key)

# If the hash of the key/value is included in the database cryptographic state, 
# the data is consistent and it is not been tampered. 
assert response.verified==True

# In the response we also have additional fields, such as the transaction id
# and the unix epoch timestamp of the insertion,, which are also 
# cryptographically verified.

print("The value is {} at transaction {} with timestamp".
    format(readback.value.decode('utf8'),response.id,readback.timestamp))
