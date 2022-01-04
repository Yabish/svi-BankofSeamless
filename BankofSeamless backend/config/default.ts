import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT || 2400,
    balance: process.env.BALANCE || 100000,
};
