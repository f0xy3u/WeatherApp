// Day elements
const dayElements = {
    morning: document.querySelector('.day.morning'),
    afternoon: document.querySelector('.day.afternoon'),
    evening: document.querySelector('.day.evening'),
    night: document.querySelector('.day.night')
};

// Temperature elements
const temperatureElements = {
    morning: document.querySelector('.temperature.morning'),
    afternoon: document.querySelector('.temperature.afternoon'),
    evening: document.querySelector('.temperature.evening'),
    night: document.querySelector('.temperature.night')
};

// Weather status elements
const weatherStatusElements = {
    morning: document.querySelector('.weatherStatus.morning'),
    afternoon: document.querySelector('.weatherStatus.afternoon'),
    evening: document.querySelector('.weatherStatus.evening'),
    night: document.querySelector('.weatherStatus.night')
};

// Moisture elements
const moistureElements = {
    morning: document.querySelector('.moisture.morning'),
    afternoon: document.querySelector('.moisture.afternoon'),
    evening: document.querySelector('.moisture.evening'),
    night: document.querySelector('.moisture.night')
};

// Setting time
const time = new Date().getHours();
 
// Set the element style based by the time
function setTimeStyle(time) {
    dayTime = selectDayTime(time);
    previousDayTime = selectPreviousDayTime(time);
    dayElements[dayTime].style.fontWeight = "500";
    dayElements[dayTime].style.fontStyle = "normal";
    if (previousDayTime == 'night') {
        return;
    }
    if (dayTime != 'morning' || dayTime != `afternoon`) {
        if (dayTime == 'evening') {
            temperatureElements[`morning`].style.color = "#a5a5a5"
        }
        if (dayTime == 'night') {
            temperatureElements[`morning`].style.color = "#a5a5a5"
            temperatureElements[`afternoon`].style.color = "#a5a5a5"
        }
    }
    temperatureElements[previousDayTime].style.color = "#a5a5a5"
}

// Return the day time, which is already over
function selectDayTime(time) {
    if (time < 12) {
        return 'morning';
    } else if (time < 16) {
        return 'afternoon';
    } else if (time < 22) {
        return 'evening';
    } else {
        return 'night';
    }
}

function selectPreviousDayTime(time) {
    if (time < 12) {
        return 'night';
    } else if (time < 16) {
        return 'morning';
    } else if (time < 22) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}


// Declaring variables
setTimeStyle(time);