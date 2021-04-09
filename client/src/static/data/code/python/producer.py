from immudb.client import ImmudbClient
import json
ic = ImmudbClient()
ic.login(username="immudb", password="immudb")

# Let's create a fictional bank transfer:
key="BANK_TRANSFER_001"
data={
    "bank_transaction_id":762349991002,
    "from":"Bob",
    "to":"Mark",
    "amount":420.00
    }

print("Entering money transfer data into immudb")

# values must encode to bytes
response = ic.verifiedSet(
    key.encode("utf8"),
    json.dumps(data).encode("utf8")
    )
print(f"Data saved with transaction {response.id}, verified: {response.verified}")