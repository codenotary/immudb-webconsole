#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

IMMUDB_URL=http://localhost:8080
DELAY=1

echo "::Insert immudb credentials"
read -p "Username: " USERNAME
stty -echo
read -s -p "Password: " PASSWORD
stty echo

USERNAME_BASE64=$(echo -n $USERNAME | base64)
PASSWORD_BASE64=$(echo -n $PASSWORD | base64)
TOKEN=$(curl -sS -X POST -d "{\"user\": \"$USERNAME_BASE64\", \"password\": \"$PASSWORD_BASE64\"}" "${IMMUDB_URL}/api/login" | jq -r .token)

if [[ "$TOKEN" == 'null' ]]
then
	echo
	echo "------------"
	echo "::Wrong credentials or immudb error (check if it's running)"
	echo "::Terminating script"
	exit -1
fi

echo
read -p "::On which database do you want to add mocked data (default: 'defaultdb')" DATABASE
DATABASE="${DATABASE:=defaultdb}"
TOKEN=$(curl -sS -X GET -H "authorization: Bearer $TOKEN" "${IMMUDB_URL}/api/db/use/${DATABASE}" | jq -r .token)

if [[ "$TOKEN" == 'null' ]]
then
	echo "------------"
	echo "::Database does not exists or immudb error (check if it's running)"
	echo "::Terminating script"
	exit -1
fi

read -p "::How many iterations? (default: '100', '-1' to run indefinitely) " ITERATIONS
ITERATIONS="${ITERATIONS:=100}"

if [[ $ITERATIONS == '-1' ]]
then
	echo "::Starting Set ops (indefinitely each ${DELAY} seconds)"
else 
	echo "::Starting Set ops (${ITERATIONS} times)"
fi

i=0
while [ "$i" -lt "$ITERATIONS" -o "$ITERATIONS" -eq "-1" ]; do
	((i=$i + 1))

	KEY=$(echo -n key$i | base64)
	VAL=$(echo -n val$i | base64)

	KEY=$(curl -sS -X POST -H "authorization: Bearer $TOKEN" -d "{\"KVs\": [{\"key\": \"$KEY\", \"value\": \"$VAL\"}]}" "${IMMUDB_URL}/api/db/set")

	if [ "$ITERATIONS" -eq "-1" ]; then
		sleep $DELAY
	fi
done

echo "------------"
echo "::Set finished successfully"
echo "::Terminating script"
exit -1