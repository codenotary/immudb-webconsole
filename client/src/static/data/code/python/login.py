# import the client class from immudb package:
from immudb.client import ImmudbClient

"""
If you don't specify hostname and port, default is "localhost:3322",
So the next line could be also written as:
ic=ImmudbClient()
"""
ic=ImmudbClient("localhost:3322")

# using default user "immudb" and default password "immudb"
ic.login(username="immudb",password="immudb")

# Now we ready to go! 
# Try changing some parameters (i.e. the password) and see the results!
