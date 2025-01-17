#!/bin/bash

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

# Initialize variables to hold the vector elements and the counter
vector_data=""
counter=0
total_entries=$(jq '. | length' "$JSON_FILE")
current_entry=0

# Function to make the dfx canister call with the constructed vector
make_call() {
    local vector_data="$1"
    command="dfx canister call airdrop_canister add_share_allocations '(vec {${vector_data}})'"
    echo "Executing: $command"
    eval "$command"
    
    # Check for errors during execution
    if [ $? -ne 0 ]; then
        echo "Error: Failed to execute the dfx canister call."
        exit 1
    fi
}

# Read the JSON file and process the account_id and Amount fields
jq -c '.[]' "$JSON_FILE" | while read -r line; do
    account_id=$(echo "$line" | jq -r '.account_id')
    amount=$(echo "$line" | jq -r '.Amount')

    # Skip if the amount is 0 or empty
    if [ -z "$amount" ] || [ "$amount" -eq 0 ]; then
        continue
    fi

    # Append the extracted values as a record to the vector data
    vector_data+="record {\"$account_id\"; $amount : nat;};"

    # Increment the counter and check if it reached the limit of 100 items
    counter=$((counter + 1))
    current_entry=$((current_entry + 1))

    if [ "$counter" -ge 100 ]; then
        # Remove trailing semicolon and make the canister call with the current vector data
        vector_data="${vector_data%;}"
        make_call "$vector_data"
        
        # Reset the vector data and counter
        vector_data=""
        counter=0
    fi

    # Check if this is the last entry
    if [ "$current_entry" -eq "$total_entries" ]; then
        # Remove trailing semicolon and make the final call with any remaining data
        if [ -n "$vector_data" ]; then
            vector_data="${vector_data%;}"
            make_call "$vector_data"
        fi
    fi
done
