import { Request, Response } from "express";
import { getBalanceAmount } from "../service/balance.service";

export function getBalance(req: Request, res: Response) {
    let response = {
        code: 200,
        data: {
            balance: getBalanceAmount() as number,
        },
    };
    return res.send(response);
}
