use candid::{CandidType, Nat, Principal};
use ic_exports::{ic_cdk::{api::is_controller, call}, ic_kit::CallResult};
use icrc_ledger_types::icrc1::{account::Account, transfer::{Memo, TransferArg, TransferError}};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteBuf;

use crate::{state::get_token_pid, types::AirdropError};

#[derive(CandidType, Deserialize, Serialize)]
pub struct Tokens {
     e8s : u64,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct TimeStamp{
    timestamp_nanos: u64
}

type TextAccountIdentifier = String;

#[derive(CandidType, Deserialize, Serialize)]
pub struct SendArgs{
    memo: Memo,
    amount: Tokens,
    fee: Tokens,
    from_subaccount: Option<Account>,
    to: TextAccountIdentifier,
    created_at_time: Option<TimeStamp>,
}

/// Returns error if `caller` is not a controller of the canister
pub fn only_controller(caller: Principal) -> Result<(), AirdropError> {
    if !is_controller(&caller) {
        return Err(AirdropError::Unauthorized);
    }
    Ok(())
}

// /// Transfers `amount` tokens to `receiver_pid`
// pub async fn transfer_tokens(receiver_pid: Principal, amount: Nat) -> Result<(), AirdropError> {
//     let token_canister = get_token_pid();
//     not_anonymous(&token_canister)?;

//     let transfer_args = TransferArg {
//         from_subaccount: None,
//         to: Account {
//             owner: receiver_pid,
//             subaccount: None,
//         },
//         fee: None,
//         created_at_time: None,
//         memo: None,
//         amount,
//     };

//     let call_response = call(token_canister, "icrc1_transfer", (transfer_args, )).await;

//     match handle_intercanister_call::<Result<Nat, TransferError>>(call_response)? {
//         Err(err) => Err(AirdropError::TokenCanisterError(format!(
//             "Error occured on token transfer: {:#?}",
//             err
//         ))),
//         _ => Ok(()),
//     }?;

//     Ok(())
// }

/// Transfers `amount` tokens to `receiver_pid`
pub async fn transfer_tokens(receiver_pid: String, amount: u64) -> Result<(), AirdropError> {
    let token_canister = get_token_pid();
    not_anonymous(&token_canister)?;

    let send_args = SendArgs {
        memo: 0.into(), // `memo` as `nat64`.
        amount: Tokens {
            e8s: amount, // `e8s` as `nat64`.
        },
        fee: Tokens {
            e8s: 0, // Convert integer to Nat.
        },
        from_subaccount: None, // Replace `None` if a specific subaccount is required.
        to: receiver_pid, // This should be a `TextAccountIdentifier` (String).
        created_at_time: Some(TimeStamp {
            timestamp_nanos: 0, // Convert integer to Nat.
        }),

    };

    let call_response = call(token_canister, "send_dfx", (send_args, )).await;

    match handle_intercanister_call::<Result<Nat, TransferError>>(call_response)? {
        Err(err) => Err(AirdropError::TokenCanisterError(format!(
            "Error occured on token transfer: {:#?}",
            err
        ))),
        _ => Ok(()),
    }?;

    Ok(())
}

/// Returns the token's transfer fee
pub async fn token_fee() -> Result<u64, AirdropError> {
    let token_canister = get_token_pid();
    not_anonymous(&token_canister)?;

    let call_response = call(token_canister, "icrc1_fee", ()).await;

    let fee = handle_intercanister_call::<u64>(call_response)?;

    Ok(fee)
}

/// Returns `user`'s token balance
pub async fn token_balance(user: Principal) -> Result<u64, AirdropError> {
    let token_canister = get_token_pid();
    not_anonymous(&token_canister)?;

    let account = Account {
        owner: user,
        subaccount: None,
    };

    let call_response = call(token_canister, "icrc1_balance_of", (account,)).await;

    let fee = handle_intercanister_call::<u64>(call_response)?;

    Ok(fee)
}

pub fn not_anonymous(id: &Principal) -> Result<(), AirdropError> {
    if id == &Principal::anonymous() {
        return Err(AirdropError::ConfigurationError);
    }
    Ok(())
}

pub fn handle_intercanister_call<T>(
    canister_response: CallResult<(T,)>,
) -> Result<T, AirdropError> {
    match canister_response {
        Ok((response,)) => Ok(response),
        Err((_code, message)) => Err(AirdropError::Unknown(message)),
    }
}