#!/usr/bin/env node

//import http2 from "http2";
import spdy from "spdy";
import fs from "fs";

import debug from "debug";
import dotenv from "dotenv";
dotenv.config();

import app from "../app.js";

const debugExpress = debug("express-template:server");

const port = process.env.PORT;
app.set("port", port);

const server = spdy.createServer(
  {
    key: fs.readFileSync("./tls/localhost-key.pem"),
    cert: fs.readFileSync("./tls/localhost.pem"),
  },
  app
);
server.listen(port);

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    //break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    //break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debugExpress("Listening on " + bind);
};

server.on("error", onError);
server.on("listening", onListening);
