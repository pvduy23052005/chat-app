import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as database from "./config/database";
import indexRoute from "./routes/index.route";
import http from "http"
import socketConfig from "./socket/index";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser"

const port: number | string | undefined = process.env.PORT || 5000;
const app: Express = express();

// config socket.io 
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key", // Replace with a strong, unique secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // Example: session lasts for 1 minute
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");

  next();
});

database.connectDatabase();

indexRoute(app);

socketConfig(server);


server.listen(port, () => {
  console.log(`Server listening: ${port}`);
})