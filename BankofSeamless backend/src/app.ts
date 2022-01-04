import express, { Express } from "express";
import config from "config";
import cors from "cors";
import routes from "./routes";

const app: Express = express();

const port: number = config.get("port");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    routes(app);
});
