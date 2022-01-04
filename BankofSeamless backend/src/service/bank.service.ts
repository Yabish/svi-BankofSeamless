import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { parse } from "node-html-parser";
import { countryIbanLookup } from "../model/country-iban.model";

export function ibanValidityCheck(iban: string): boolean {
    let countryCode = iban.substring(0, 2);

    if (countryIbanLookup.hasOwnProperty(countryCode)) {
        let length = countryIbanLookup[countryCode][1];
        if (iban.length !== length) {
            return false;
        }
    } else return false;

    return true;
}

export function ibanCountryCheck(iban: string, currency?: string): boolean {
    let countryCode = iban.substring(0, 2);

    if (countryIbanLookup.hasOwnProperty(countryCode)) {
        let currencyCode = countryIbanLookup[countryCode][0];
        if (currency && currency !== currencyCode) {
            return false;
        }
    } else return false;

    return true;
}

export async function getInbanInformation(iban: string) {
    let src: string | undefined = "";
    let alt: string | undefined = "";
    let err: any | undefined;

    const form = new FormData();
    form.append("userInputIban", iban);

    await axios
        .post("https://transferwise.com/us/iban/checker", form, {
            headers: form.getHeaders(),
        })
        .then((response: AxiosResponse) => {
            const root = parse(response.data);

            src = root.querySelector(".bank-logo")?.getAttribute("src");
            alt = root.querySelector(".bank-logo")?.getAttribute("alt");
        })
        .catch((error: any) => {
            err = error;
        });

    return {
        src,
        alt,
        err,
    };
}
