// 
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
var cpuTemp = 0;
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
        console.log(`Client IP        : ${socket.handshake.address.slice(7)}`);
    });

// Action when the client sends measured data
    socket.on("measures", (data) => {
        try {
            measureData = JSON.parse(data);
            timeStamp = measureData.timeStamp;
            tempA = measureData.sensorA[0];
            resA = measureData.sensorA[1];
            tempB = measureData.sensorB[0];
            resB = measureData.sensorB[1];
            opStatus = measureData.status;
            cpuTemp = measureData.cpuTemp;
            userTemp = measureData.userTemp;
            tankLevel = measureData.tankLevel;
            console.log(`Timestamp           : ${timeStamp}`);
            console.log(`CPU Temperature     : ${cpuTemp} °C`);
            console.log(chalk.green(`Channel A : ${tempA} °C  ${chalk.inverse(resA)} Ω`));
            console.log(chalk.yellow(`Channel B : ${tempB} °C  ${chalk.inverse(resB)} Ω`));
            opStatus === true || opStatus === 1? 
                console.log(`Status : ${chalk.inverse.green(opStatus)}`): 
                console.log(`Status : ${chalk.inverse.red(opStatus)}`);
            tankLevel === true || tankLevel === 1?
                console.log(`Tank Level : ${chalk.inverse.red('MAX')}`):
                console.log(`Tank Level : ${chalk.inverse.green('OK')}`); 
            console.log(`Threshold    : ${userTemp} °C`);
            console.log(`-------------------------------`)
        }
        catch (e) {
            console.log(`${errorMsg} values!`);
        }

    });
});

app.get("/", (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        console.log(`Status: ${opStatus}`);
        res.render("index.ejs", { userTemp: userTemp, tempA: tempA, resA: resA, tempB: tempB, resB: resB, sts: opStatus, cpuTemp: cpuTemp });
    }
    catch {
        console.log(chalk.inverse.orange("Reading..."));
        res.render("index.ejs", { userTemp: errorMsg, tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg, sts: opStatus, cpuTemp: errorMsg });

    }
});

app.get("/updateTemp", (req, res) => {
    try {
        console.log(chalk.inverse.cyan("Update data request from Web client OK"));
        res.send({ userTemp: userTemp, tempA: tempA, resA: resA, tempB: tempB, resB: resB, sts: opStatus, cpuTemp: cpuTemp });
    }
    catch (e) {
        console.log(chalk.inverse.red("Update data request from Web client failed!"));
        res.send({ userTemp: errorMsg, tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg, sts: opStatus, cpuTemp: errorMsg });

    }
});

app.get("/userTemp", (req, res) => {
    console.log(chalk.inverse.yellow(`User temperature : `));
})

app.get("/startBtn", (req, res) => {
    io.emit("start");
    console.log(chalk.green("Start Button pressed!"));
    opStatus = true;
    res.send({ sts: opStatus });
});

app.get("/stopBtn", (req, res) => {
    io.emit("stop");
    console.log(chalk.red("Stop Button pressed!"));
    opStatus = false;
    res.send({ sts: opStatus });
});

app.get("/emgBtn", (req, res) => {
    console.log(chalk.inverse.red("EMERGENCY Button pressed!"));
    opStatus = false;
    res.send({ sts: opStatus });
});
// app.get("/sliderChange", (req, res) => {
//     res.send({ userTemp: userTemp });
// })
app.get("/levelSensor", (req, res) => {
    console.log(chalk.inverse.redBright(`Level sensor --------`));
});
app.get("/rotaryEncoder", (res, req) => {
    console.log(chalk.inverse.redBright(`Rotary push button --------`));
})
server.listen(wsPort, () => { 
    console.log(chalk.inverse(`WS Server running on port ${wsPort}.`));
});
app.listen(httpPort, () => {
    console.log(chalk.inverse.cyan(`Http Server running on port ${httpPort}.`));
});