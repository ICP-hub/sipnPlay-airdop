use std::{cell::RefCell, collections::HashMap};

use candid::{Nat, Principal};

thread_local! {
    /// Token canister's principal ID
    pub static TOKEN_PID: RefCell<Principal> = RefCell::new(Principal::anonymous());
    /// HashMap of all participants and their receiving amount
    pub static TOKEN_ALLOCATIONS: RefCell<HashMap<String, Nat>> = RefCell::new(HashMap::new());
    /// HashMap of all participants and their shares
    pub static SHARE_ALLOCATIONS: RefCell<HashMap<String, Nat>> = RefCell::new(HashMap::new());
}

/// Clears the token canister pid, token allocations and share allocations
pub fn clear_all() {
    TOKEN_PID.with(|pid| *pid.borrow_mut() = Principal::anonymous());
    TOKEN_ALLOCATIONS.with(|allocations| allocations.borrow_mut().clear());
    SHARE_ALLOCATIONS.with(|allocations| allocations.borrow_mut().clear());
}

/// Returns the token's principal ID
pub fn get_token_pid() -> Principal {
    TOKEN_PID.with(|pid| pid.borrow().clone())
}

/// Returns the amount of shares allocated to `user`
pub fn get_user_shares(user: String) -> Option<Nat> {
    SHARE_ALLOCATIONS.with(|allocations| allocations.borrow().get(&user).cloned())
}

/// Returns the vector of all users and their share allocations
pub fn get_all_share_allocations() -> Vec<(String, Nat)> {
    SHARE_ALLOCATIONS.with(|allocations| allocations.borrow().clone().into_iter().collect())
}

/// Add a share allocation
pub fn add_share_allocation(user: String, amount: Nat) {
    SHARE_ALLOCATIONS.with(|allocations| allocations.borrow_mut().insert(user, amount));
}

/// Returns the amount of tokens allocated to `user`
pub fn get_user_tokens(user: String) -> Option<Nat> {
    TOKEN_ALLOCATIONS.with(|allocations| allocations.borrow().get(&user).cloned())
}

/// Returns the vector of all users and their token allocations
pub fn get_all_token_allocations() -> Vec<(String, Nat)> {
    TOKEN_ALLOCATIONS.with(|allocations| {
        allocations.borrow().iter().map(|(k, v)| (k.to_string(), v.clone())).collect()
    })
}

/// Add a token allocation
pub fn add_token_allocation(user: String, amount: Nat) {
    TOKEN_ALLOCATIONS.with(|allocations| allocations.borrow_mut().insert(user, amount));
}