import config from "config";

let balance = config.get("balance") as number;
balance = +balance;

export function getBalanceAmount() {
    return balance;
}

export function setBalanceAccount(amount: number) {
    balance -= amount;
    
}
