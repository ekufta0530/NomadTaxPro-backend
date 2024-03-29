import express from "express";
import userRoutes from "./routes/userRoutes.js";
import awsRoutes from "./routes/awsRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { engine } from "express-handlebars";
import handlebars from "handlebars";
import { transporter } from "./utils/sendEmail.js";
import fs from "fs";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import { StayCountry } from "./models/countryModel.js";
import cron from "node-cron";
import { updateDaysCompletedForAllStays } from "./utils/schedular.js";
import morgan from "morgan";

// Connect to MongoDB
connectDB();

// Server
const port = 4000;
const app = express();

morgan.token("jsonData", (req, res) => {
  return JSON.stringify(req.body);
});

const logMiddleware = (req, res, next) => {
  if (req.originalUrl === "/api/country/request-info") {
    morgan(":jsonData")(req, res, next);
  } else {
    next();
  }
};

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "PUT", "GET", "DELETE", "PATCH"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/aws", awsRoutes);
app.use("/api/country", logMiddleware, countryRoutes);

// Handlebars
const headerSource = fs.readFileSync(
  "views/partials/header.handlebars",
  "utf8"
);
const footerSource = fs.readFileSync(
  "views/partials/footer.handlebars",
  "utf8"
);
handlebars.registerPartial("header", headerSource);
handlebars.registerPartial("footer", footerSource);
const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./views/partials"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".handlebars",
};
transporter.use("compile", hbs(handlebarOptions));
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));

// Schedule cron job
cron.schedule("0 * * * *", async () => {
  try {
    const allStayCountries = await StayCountry.find();
    for (const stayCountry of allStayCountries) {
      await updateDaysCompletedForAllStays(stayCountry);
    }
    console.log("Days completed updated successfully for all stays.");
  } catch (error) {
    console.error("Error updating days completed:", error);
  }
});

// Start server
app.get("/", (req, res) => res.send("Server running!"));
app.use(notFound);
app.use(errorHandler);
app.listen(port, "0.0.0.0", () => console.log(`Server started on ${port}`));
