import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as database from "./config/database";

const port: number | string | undefined = process.env.PORT;
const app: Express = express();

// config pug . 
app.set('views', path.join(__dirname, "src", 'views'));
app.set('view engine', 'pug');

// config public  . 
app.use(express.static(path.join(__dirname, "public")));

database.connectDatabase();

app.get("/", (req, res) => {
  res.send("ok");
})

app.listen(port, () => {
  console.log(`Server listening: ${port}`);
})