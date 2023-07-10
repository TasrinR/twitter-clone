const express = require("express");
const frameguard = require("frameguard");
const cors = require("cors");
const next = require("next");
const connectDB = require("./src/config/DB");
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const hostname = "localhost";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const { Server } = require("socket.io");

app
  .prepare()
  .then(() => {
    const server = express();

    connectDB();

    server.use(frameguard({ action: "sameorigin" }));
    server.use(express.json());
    server.use(
      express.urlencoded({
        extended: true,
      })
    );

    server.use(
      cors({
        origin: "*",
      })
    );

    server.get("/test", (req, res) => {
      res.send(
        `isProduction = ${process.env.ENV_TYPE} ${process.env.AUTH}`,
        200
      );
    });

    // disable auth in production
    server.all("*", function (req, res, next) {
      next();
    } , (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
  })

  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
