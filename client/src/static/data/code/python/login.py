# Import the client class from immudb package:
from immudb.client import ImmudbClient

# Instantiate the client class.
# Note that "localhost:3322" is the default,
# so the following line could also be:
# ic = ImmudbClient()
ic = ImmudbClient("localhost:3322")

# We can access defaultdb
# using default user "immudb"
# and default password "immudb"
ic.login(username="immudb", password="immudb")

# Now we are ready to go! 
# Try changing some parameters (i.e. the password)
# and you should see an error.
