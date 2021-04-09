from immudb import ImmudbClient
import string
import random
import argparse

def get_random_string(length):
	return ''.join(random.choice(string.ascii_letters+string.digits) for i in range(length))

def NotarizeTransaction(ic, transaction_id, sender, receiver, amount, description):
	key = f'TRANSACTION:{transaction_id}:SENDER'
	response = ic.verifiedSet(key.encode('utf8'), sender.encode('utf8'))
	assert response.verified

	key = f'TRANSACTION:{transaction_id}:RECEIVER' 
	response = ic.verifiedSet(key.encode('utf8'), receiver.encode('utf8'))
	assert response.verified

	key = f'TRANSACTION:{transaction_id}:AMOUNT'
	response = ic.verifiedSet(key.encode('utf8'), str(amount).encode('utf8'))
	assert response.verified

	key = f'TRANSACTION:{transaction_id}:DESCRIPTION'
	response = ic.verifiedSet(key.encode('utf8'), description.encode('utf8'))
	assert response.verified

def NotarizeReceipt(ic, transaction_id, receipt_filename):
	with open(receipt_filename,"rb") as f:
		receipt_content = f.read()
	key = f'TRANSACTION:{transaction_id}:RECEIPT' 
	response = ic.verifiedSet(key.encode('utf8'), receipt_content)
	assert response.verified

def NotarizeTransactionBatch(ic, transaction_id, sender, receiver, amount, description):
	transaction = {
		'TRANSACTION:{}:SENDER'.format(transaction_id) : sender,
		'TRANSACTION:{}:RECEIVER'.format(transaction_id) : receiver,
		'TRANSACTION:{}:AMOUNT'.format(transaction_id) : str(amount),
		'TRANSACTION:{}:DESCRIPTION'.format(transaction_id) : description,
		}
	encoded_transaction = {
		x[0].encode('utf8'):x[1].encode('utf8') for x in transaction.items()
		}
	response = ic.setAll(encoded_transaction)
	readback = ic.verifiedTxById(response.id)
	for i in transaction.keys():
		assert i.encode('utf8') in readback

parser = argparse.ArgumentParser(description='Showcase demo')
parser.add_argument('--sender', type=str, default='Tim', help='Sender Name')
parser.add_argument('--recipient', type=str, default='Tom', help='Recipient Name')
parser.add_argument('--amount', type=float, default=500.0, help='Amount transferred')
parser.add_argument('--description', type=str, default='payment', help='Transaction description')
parser.add_argument('--receipt', type=str, help='Recipient filename')
parser.add_argument('--batched', default=False, action='store_true', help='Use batch operation')

args=parser.parse_args()

ic = ImmudbClient()
ic.login("immudb", "immudb")
ic.databaseUse("defaultdb")

transaction_id = get_random_string(16)
print("Transaction id:", transaction_id)
if args.batched:
	NotarizeTransactionBatch(ic, transaction_id, args.sender, args.recipient, args.amount, args.description)
else:
	NotarizeTransaction(ic, transaction_id, args.sender, args.recipient, args.amount, args.description)
if args.receipt != None:
	NotarizeReceipt(ic, transaction_id, args.receipt)