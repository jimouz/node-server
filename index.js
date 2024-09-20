// 
// 
// 
// 
// 

const express = require("express");
const chalk = require("chalk");
const server = require("http").createServer(express);
const bodyParser = require("body-parser");
const io = require("socket.io")(server);
const ejs = require("ejs");
const buttonRouter = require("./routers/buttons")(io, opStatus);
// const { request } = require("http");

const app = express();

// Web Socket server port
const wsPort = 3000;
// Express server port
const httpPort = 3001;

app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended:true}));
app.use(buttonRouter);

// Starting conditions
const errorMsg = "Reading...";
var opStatus = 0;
var cpuTemp = 0;
var out1 = 0;
var out2 = 0;
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
            out1=measureData.out1;
            out2=measureData.out2;
            console.log(`Timestamp            : ${timeStamp}`);
            console.log(`CPU Temperature      : ${cpuTemp} °C`);
            console.log(chalk.green(`Channel A : ${tempA} °C  ${chalk.inverse(resA)} Ω`));
            console.log(chalk.yellow(`Channel B : ${tempB} °C  ${chalk.inverse(resB)} Ω`));
            opStatus === true || opStatus === 1? 
                console.log(`Status : ${chalk.inverse.green(opStatus).padStart(39)}`): 
                console.log(`Status : ${chalk.inverse.red(opStatus).padStart(39)}`);
            tankLevel === true || tankLevel === 1?
                console.log(`Tank Level : ${chalk.inverse.red('MAX').padStart(35)}`):
                console.log(`Tank Level : ${chalk.inverse.green('OK').padStart(35)}`); 
            console.log(`Threshold  : ${userTemp.toString().padStart(16)} °C`);
            console.log(`Output 1             : ${out1}`);
            console.log(`Output 2             : ${out2}`);
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
        res.render("index.ejs", { userTemp: userTemp, tempA: tempA, resA: resA, tempB: tempB, resB: resB, sts: opStatus, cpuTemp: cpuTemp, out1: out1, out2: out2, tankLevel: tankLevel });
    }
    catch {
        console.log(chalk.inverse.orange("Reading..."));
        res.render("index.ejs", { userTemp: errorMsg, tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg, sts: opStatus, cpuTemp: errorMsg, out1: out1, out2: out2, tankLevel: tankLevel });
    }
});

app.get("/updateTemp", (req, res) => {
    try {
        console.log(chalk.inverse.cyan("Update data request from Web client OK"));
        res.send({ userTemp: userTemp, tempA: tempA, resA: resA, tempB: tempB, resB: resB, sts: opStatus, cpuTemp: cpuTemp, out1: out1, out2: out2, tankLevel: tankLevel });
    }
    catch (e) {
        console.log(chalk.inverse.red("Update data request from Web client failed!"));
        res.send({ userTemp: errorMsg, tempA: errorMsg, resA: errorMsg, tempB: errorMsg, resB: errorMsg, sts: opStatus, cpuTemp: errorMsg, out1: out1, out2: out2, tankLevel: tankLevel });

    }
});

app.get("/userTemp", (req, res) => {
    console.log(chalk.inverse.yellow(`User temperature : `));
});

// Send slider value to IOT hardware
app.post("/sliderChange", (req, res, data) => {
    let userTemp = req.body.userTemp;
    io.emit("sliderChange", userTemp);
    res.send({ userTemp: userTemp });
    console.log(chalk.red(`Slider changed!! ${userTemp}`));
});

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