import { Request, Response } from "express";
import {
    getInbanInformation,
    ibanValidityCheck,
} from "../service/bank.service";

export async function getIbanInfo(req: Request, res: Response) {
    let iban = req.params.iban as string;

    let isValid = ibanValidityCheck(iban);

    if (!isValid) {
        return res.status(200).send({
            code: 400,
            error: {
                status: "Bad Request",
                message: "Invalid IBAN",
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
            code: 404,
            error: {
                status: "Not Found",
                message:
                    "IBANs which are syntactically valid, but bank doesn’t exist",
            },
        });
        return;
    }

    return res.status(200).send({
        code: 203,
        data: {
            bank: ibaninfo.alt,
            logo: ibaninfo.src,
        },
    });
}
