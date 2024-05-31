const express = require("express");
const router = new express.Router();
const chalk = require("chalk");

module.exports = (io) => {
    // Define my routes here
    
    // Start button route
    router.get("/startBtn", (req, res) => {
        io.emit("start");
        console.log(chalk.green("Start Button pressed!"));
        opStatus = true;
        res.send({ sts: opStatus });
    });
    // Stop button route
    router.get("/stopBtn", (req, res) => {
        io.emit("stop");
        console.log(chalk.red("Stop Button pressed!"));
        opStatus = false;
        res.send({ sts: opStatus });
    });
    // Emergency button route
    router.get("/emgBtn", (req, res) => {
        console.log(chalk.inverse.red("EMERGENCY Button pressed!"));
        opStatus = false;
        res.send({ sts: opStatus });
    });
    return router;
  };