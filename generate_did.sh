#!/usr/bin/env bash
function generate_did() {
    local canister=$1
    canister_root="$canister"

    cargo build --manifest-path="$canister_root/Cargo.toml" \
    --target wasm32-unknown-unknown \
    --release --package "$canister"

    candid-extractor "target/wasm32-unknown-unknown/release/airdrop_canister.wasm" > "airdrop_canister/candid.did"
}


CANISTERS=airdrop_canister

for canister in $(echo $CANISTERS | sed "s/,/ /g")
do
  generate_did "$canister"
done