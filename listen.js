const app = require("./app");
app.set("port", process.env.port || 3000);

app.listen(app.get("port"), (server) => {
  console.info(`Server listening on port ${app.get("port")}`);
});

// const {PORT = 9090 } = process.env;

// app.listen(PORT)
