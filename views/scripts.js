let sliderValue = 0;
$(document).ready( () => {
    // myClock();
    setInterval(myClock, 1000);
    setInterval(update_temp, 1000);
    // Slider input
    document.querySelector('.slider').oninput = function() {
        sliderValue = document.querySelector('.slider').value;
        $('.user-temp').text(`${document.querySelector('.slider').value} °C`);
        sliderInput();
    }
})

// Update all values
function update_temp(){
    $.ajax({
        url: '/updateTemp',
        method: 'GET',
        success: (data) => {
            // console.log(data);
            $('.cpuTemp').text(`${data.cpuTemp} °C`);
            document.querySelector('.slider').value=Number(data.userTemp);
            $('.user-temp').text(`${document.querySelector('.slider').value} °C`);
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
            (data.out1 === 1 || data.out1 === true)?
                $('#out1').css('background', 'linear-gradient(#0f0a, #0a0)').css('color',"#fff"):
                $('#out1').css('background', 'linear-gradient(#fff, #f004)').css('color',"#444");
            (data.out2 === 1 || data.out2 === true)?
                $('#out2').css('background', 'linear-gradient(#0f0a, #0a0)').css('color',"#fff"):
                $('#out2').css('background', 'linear-gradient(#fff, #f004)').css('color',"#444");
            (data.tankLevel === 1 || data.tankLevel === true)?
                $('#tank').text('Level MAX').css('background', 'linear-gradient(#08f8, #08f)').css('color',"#ff0"):
                $('#tank').text('Level OK').css('background', 'linear-gradient(#fff, #08f4)').css('color',"#444");
            
        }
    });
}
// Slider input
function sliderInput() {
    $.ajax({
        url: '/sliderChange',
        method: 'POST',
        data: {
             userTemp: sliderValue
        },
        success: (data) => {
                console.log(`Slider changed! ${data.userTemp}`);
                $('.user-temp').text(`${data.userTemp}`); 
        }
    })
}
// Start button
function startDist() {
    $.ajax({
        url: '/startBtn',
        method: 'GET',
        success: (data) => {
            console.log(`Start Button pressed! ${data} `);
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