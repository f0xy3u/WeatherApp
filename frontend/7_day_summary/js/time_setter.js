// Day elements
const dayElements = {
    day1: document.querySelector('.day.day1'),
    day2: document.querySelector('.day.day2'),
    day3: document.querySelector('.day.day3'),
    day4: document.querySelector('.day.day4'),
    day5: document.querySelector('.day.day5'),
    day6: document.querySelector('.day.day6'),
    day7: document.querySelector('.day.day7')
};

// Temperature elements
const maxTempElements = {
    day1: document.querySelector('.temperature.day1 .maxTemp'),
    day2: document.querySelector('.temperature.day2 .maxTemp'),
    day3: document.querySelector('.temperature.day3 .maxTemp'),
    day4: document.querySelector('.temperature.day4 .maxTemp'),
    day5: document.querySelector('.temperature.day5 .maxTemp'),
    day6: document.querySelector('.temperature.day6 .maxTemp'),
    day7: document.querySelector('.temperature.day7 .maxTemp')
};

const lowTempElements = {
    day1: document.querySelector('.temperature.day1 .lowTemp'),
    day2: document.querySelector('.temperature.day2 .lowTemp'),
    day3: document.querySelector('.temperature.day3 .lowTemp'),
    day4: document.querySelector('.temperature.day4 .lowTemp'),
    day5: document.querySelector('.temperature.day5 .lowTemp'),
    day6: document.querySelector('.temperature.day6 .lowTemp'),
    day7: document.querySelector('.temperature.day7 .lowTemp')
};

// Weather status elements
const weatherStatusElements = {
    day1: document.querySelector('.weatherStatus.day1'),
    day2: document.querySelector('.weatherStatus.day2'),
    day3: document.querySelector('.weatherStatus.day3'),
    day4: document.querySelector('.weatherStatus.day4'),
    day5: document.querySelector('.weatherStatus.day5'),
    day6: document.querySelector('.weatherStatus.day6'),
    day7: document.querySelector('.weatherStatus.day7')
};

// Moisture elements
const moistureElements = {
    day1: document.querySelector('.moisture.day1'),
    day2: document.querySelector('.moisture.day2'),
    day3: document.querySelector('.moisture.day3'),
    day4: document.querySelector('.moisture.day4'),
    day5: document.querySelector('.moisture.day5'),
    day6: document.querySelector('.moisture.day6'),
    day7: document.querySelector('.moisture.day7')
};

//Setting time
const time = new Date().getHours();
const date = new Date().getDate();
const month = new Date().getMonth();
const day = new Date().getDay();

console.log(day)

const days = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];

//Setting date data
function setDate(element, day, id) {
    if (day > 6) {
        day = 0 + (day - 7);
    }
    let monthCheck = 0
    if (date + id > 30) {
        monthCheck = 1
    }
    dayElements[element].textContent = `${days[day]} ${date+id}. ${month + 1 + monthCheck}.`;
}

setDate('day1', day, 0);
setDate('day2', day + 1, 1);
setDate('day3', day + 2, 2);
setDate('day4', day + 3, 3);
setDate('day5', day + 4, 4);
setDate('day6', day + 5, 5);
setDate('day7', day + 6, 6);

