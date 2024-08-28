import express from "express";
import bodyparser from "body-parser";
import morgan from "morgan";

let app = express();
app.use(morgan("common"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

export default app;
