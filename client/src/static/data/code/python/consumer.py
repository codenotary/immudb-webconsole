from immudb.client import ImmudbClient
import json
ic = ImmudbClient()
ic.login(username="immudb", password="immudb")

# Let's retrieve the bank transfer from the previous example:
key="BANK_TRANSFER_001"
print("Reading money transfer data from immudb")

# values must encode to bytes
readback = ic.verifiedGet( key.encode("utf8") )
print(f"Data was saved with transaction {readback.id}, verified: {readback.verified}")
data = json.loads(readback.value.decode('utf8'))
print("Data: ", data)
