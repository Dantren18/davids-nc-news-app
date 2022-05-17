const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routers/api.router");

const {handlePSQLError,
  handleCustomError,
  handleServerError,
  handle400Error,
  handle404Error,
} = require("./errors");

app.get("/", (req, res, next) => {
  res.status(200).send({ msg: "Welcome to David's NC-news app!" });
});

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

///ERRORS

app.use(handlePSQLError);
app.use(handleCustomError);
app.use(handle400Error);
app.use(handle404Error);
app.use(handleServerError);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Something Internal Went Wrong" });
});

module.exports = app;
