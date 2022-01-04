import { setBalanceAccount } from "./balance.service";

export function amountTransfer(amount: number) {
    // TODO : Implement the logic to transfer amount from one account to another
    // If tranfser completes successfully, setBalanceAccount should be called
    setBalanceAccount(amount);
}
