import { Express, Request, Response } from "express";
import { getBalance } from "./controller/balance.controller";
import { getIbanInfo } from "./controller/bank.controller";
import { transferAmount } from "./controller/transfer.controller";

export default function (app: Express) {
    app.get("/api/v1/balance", getBalance);
    app.get("/api/v1/bank/:iban", getIbanInfo);
    app.post("/api/v1/transfer/:iban", transferAmount);
}
