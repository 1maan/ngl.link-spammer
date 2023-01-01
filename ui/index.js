import { join } from "path";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import spamWorker from "./background/producer.js";
import routes from "./routes/index.route.js";
import config from "./config.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
spamWorker();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "supersecretkeyyoushouldnotcommittogithub",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(express.static(join(__dirname, "public")));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use("/", routes);

app.listen(config.port, () => {
  console.log("Server is running on port " + config.port);
  console.log("Visit http://localhost:" + config.port + "/");
});
