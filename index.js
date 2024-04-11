// 
// 
// 
// 

const express = require("express");
const chalk = require("chalk");
const server = require("http").createServer(express);
const bodyParser = require("body-parser");
// const { request } = require("http");
const io = require("socket.io")(server);
const ejs = require("ejs");

const app = express();

// Web Socket server port
const wsPort = 3000;
// Express server port
const httpPort = 3001;

app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended:true}));

const errorMsg = "Reading...";
var opStatus = 0;
// Action when the client is connected
io.on("connection", (socket) => {
    console.log(chalk.inverse.green('---- User connected ----'));
    console.log(`Connection Time  : ${socket.handshake.time}`);
    console.log(`Socket ID        : ${socket.id}`);
    console.log(`Client IP        : ${socket.handshake.address.slice(7)}`);
// Response to client when connected
    io.emit("connected", "Connection OK");
    // io.emit("stop");
// Action when the client is disconnected
    socket.on("disconnect", () => {
        console.log(chalk.inverse.red('---- User disconnected ----'));
    });
// Action when the client sends measured data
    socket.on("measures", (data) => {
        try {
            measureData = JSON.parse(data);
            tempA = measureData.sensorA[0];
            resA = measureData.sensorA[1];
            tempB = measureData.sensorB[0];
            resB = measureData.sensorB[1];
            opStatus = measureData.status;
            console.log(chalk.green(`Channel A : ${tempA} °C  ${chalk.inverse(measureData.sensorA[1])} Ω`));
            console.log(chalk.yellow(`Channel B : ${tempB} °C  ${chalk.inverse(measureData.sensorB[1])} Ω`));
            console.log(`Status : ${chalk.inverse(opStatus)}`);
            console.log(`-------------------------------`)
        }
        catch (e) {
            console.log(errorMsg);
        }

    });
});

app.get("/", (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        console.log(`Status: ${opStatus}`);
        res.render("index.ejs", { tempA: tempA, resA: resA, tempB: tempB, resB: resB, sts: opStatus });
        // res.render ("index.ejs", {tempA: tempA, resA: resA, tempB: tempB, resB: resB});
    }
    catch {
        console.log(chalk.inverse.orange("Reading..."));
        res.render("index.ejs", { tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg, sts: opStatus });
        // res.render ("index.ejs", {tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg});

    }
});

app.get("/updateTemp", (req, res) => {
    try {
        console.log(chalk.inverse.cyan("Update data request from Web client OK"));
        res.send({ tempA: tempA, resA: resA, tempB: tempB, resB: resB, sts: opStatus });
        // res.send ({tempA: tempA, resA: resA, tempB: tempB, resB: resB});
    }
    catch (e) {
        console.log(chalk.inverse.red("Update data request from Web client failed!"));
        res.send({ tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg, sts: opStatus });
        // res.send ({tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg});

    }
});

app.get("/userTemp", (req, res) => {
    console.log(chalk.inverse.yellow(`User temperature : `));
})

app.get("/startBtn", (req, res) => {
    io.emit("start");
    console.log(chalk.green("Start Button pressed!"));
    opStatus = 1;
    res.send({ sts: opStatus });
});

app.get("/stopBtn", (req, res) => {
    io.emit("stop");
    console.log(chalk.red("Stop Button pressed!"));
    opStatus = 0;
    res.send({ sts: opStatus });
});

app.get("/emgBtn", (req, res) => {
    console.log(chalk.inverse.red("EMERGENCY Button pressed!"));
    // status = 0;
    // res.send({ sts: status });

});
app.get("/levelSensor", (req, res) => {
    console.log(chalk.inverse.redBright(`Level sensor --------`));
});

server.listen(wsPort, () => { 
    console.log(chalk.inverse(`WS Server running on port ${wsPort}.`));
});
app.listen(httpPort, () => {
    console.log(chalk.inverse.cyan(`Http Server running on port ${httpPort}.`));
});