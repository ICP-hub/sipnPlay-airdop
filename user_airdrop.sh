#!/bin/bash
dfx identity use default;

# Ensure a JSON file is provided as an argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <json_file>"
    exit 1
fi

JSON_FILE=$1

# Validate the JSON file
if ! jq empty "$JSON_FILE" 2>/dev/null; then
    echo "Error: Invalid JSON file."
    exit 1
fi

# Function to make the dfx canister call with the constructed argument
make_call() {
    local to="$1"
    local amount="$2"
    local fee=0
    local memo=0

    # Construct the Candid argument
    candid_arg="(record {
        to = \"$to\";
        fee = record { e8s = $fee : nat64 };
        memo = $memo : nat64;
        from_subaccount = null;
        created_at_time = null;
        amount = record { e8s = $amount : nat64 };
    })"

    # Execute the dfx canister call
    dfx canister call avqkn-guaaa-aaaaa-qaaea-cai send_dfx "$candid_arg"

    # Check for errors during execution
    if [ $? -ne 0 ]; then
        echo "Error: Failed to execute the dfx canister call."
        exit 1
    fi
}

# Read the JSON file and process each transaction
jq -c '.[]' "$JSON_FILE" | while read -r line; do
    account_id=$(echo "$line" | jq -r '.account_id')
    amount=$(echo "$line" | jq -r '.Amount')

    # Skip if the amount is 0 or empty
    if [ -z "$amount" ] || [ "$amount" -eq 0 ]; then
        continue
    fi

    # Make the canister call with the current transaction details
    make_call "$account_id" "$amount"
done
