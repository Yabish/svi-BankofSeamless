import { Request, Response } from "express";
import { getBalanceAmount } from "../service/balance.service";
import {
    getInbanInformation,
    ibanCountryCheck,
    ibanValidityCheck,
} from "../service/bank.service";
import { amountTransfer } from "../service/transfer.service";

export async function transferAmount(req: Request, res: Response) {
    let iban = req.params.iban as string;
    let currency = req.body.currency as string;

    let isValid = ibanValidityCheck(iban);
    if (!isValid) {
        return res.status(200).send({
            code: 400,
            error: {
                status: "Bad Request",
                message: "Invalid IBANs",
            },
        });
    }

    let isCurrencyValid = ibanCountryCheck(iban, currency);
    if (!isCurrencyValid) {
        return res.status(200).send({
            code: 409,
            error: {
                status: "Conflict",
                message:
                    "currency that doesn’t match the associated IBAN country",
            },
        });
    }

    if (getBalanceAmount() < req.body.amount) {
        return res.status(200).send({
            code: 402,
            error: {
                status: "Bad Request",
                message: "Insufficient balance",
            },
        });
    }

    let ibaninfo = await getInbanInformation(iban);

    if (ibaninfo.err) {
        res.status(200).send({
            code: 500,
            error: {
                status: "Server Error",
                message: " Internal Server Error",
            },
        });
        return;
    }

    if (!ibaninfo.src || !ibaninfo.alt) {
        res.status(200).send({
            code: 418,
            error: {
                status: "I'm a Teapot",
                message: "Oops! I'm a teapot, I can't brew coffee.",
            },
        });
        return;
    }

    amountTransfer(req.body.amount as number);

    return res
        .status(200)
        .send({ code: 202, data: { balance: getBalanceAmount() } });
}
