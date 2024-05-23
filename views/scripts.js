$(document).ready( () => {
    // myClock();
    setInterval(myClock, 1000);
    setInterval(update_temp, 1000);
})
// Update all values
function update_temp(){
    $.ajax({
        url: '/updateTemp',
        method: 'GET',
        success: (data) => {
            console.log(data);
            $('.cpuTemp').text(`${data.cpuTemp} °C`);
            $('.tempA').text(`${data.tempA} °C`);
            $('.resA').text(`${data.resA} Ω`);
            $('.tempB').text(`${data.tempB} °C`);
            $('.resB').text(`${data.resB} Ω`);
            if (data.sts === 1 || data.sts === true) 
            {
                $('.startBtn').css('background-color', '#0f0');
            }
            else if (data.sts === 0 || data.sts === false) 
            {
                $('.startBtn').css('background-color', '#8888');
            }
        }
    });
}
// Start button
function startDist() {
    $.ajax({
        url: '/startBtn',
        method: 'GET',
        success: (data) => {
            console.log(`Start Button pressed! ${data} `);
            $('.startBtn').css('background-color', '#0f0');
        }
    });
}
//  Stop button
function stopDist() {
    $.ajax({
        url: '/stopBtn',
        method: 'GET',
        success: (data) => {
            console.log(`Stop Button pressed! ${data}`);
            $('.startBtn').css('background-color', '#8888');
        }
    });
}
//  Clock
function myClock() {
    var date = new Date();
    function addZero(x) {
        if (x < 10) {
            return x = '0' + x;
        } else {
            return x;
        }
    }
    var h = addZero(date.getHours());
    var m = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());
    $('.my-time').text(h + ':' + m + ':' + s);
}