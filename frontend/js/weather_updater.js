function checkSvgId(id) {
    if (id == `04d` || id == `04n`) {
        return `03d`;
    } else {
        return id;
    }
}

let morningConst
let dayConst
let eveningConst
let nightConst

function selectTime(time) {
    morningConst = 10 - time
    if (morningConst < 0) {
        morningConst = 0
    }
    dayConst = 14 - time
    if (dayConst < 0) {
        dayConst = 0
    }
    eveningConst = 18 - time
    if (eveningConst < 0) {
        eveningConst = 0
    }
    nightConst = 22 - time
    if (nightConst < 0) {
        nightConst = Math.abs(nightConst)
    }
}

function rainProbUpdator(pop, element) {
    if (pop > 0) {
        document.querySelector(`.moisture.${element}`).innerText = `${pop}%`
        document.querySelector(`.moisture.${element}`).childNodes[0].src = `./svgs/rain.svg`
    } else { 
        document.querySelector(`.moisture.${element}`).innerText = '--' 
    };
}


async function getCityByIP() {
    try {
        const serverCheck = await fetch('https://weatherappf0xy3u.glitch.me/serverCheck');
        if (!serverCheck.ok) throw new Error('Server není dostupný');

        const ipResponse = await fetch('https://weatherappf0xy3u.glitch.me/ip');
        if (!ipResponse.ok) throw new Error('Nelze získat město z IP');
        const ipData = await ipResponse.json();
        console.log("IP data:", ipData);

        const cityIDResponse = await fetch(`https://weatherappf0xy3u.glitch.me/cityID?city=${encodeURIComponent(ipData.city)}`);
        if (!cityIDResponse.ok) throw new Error('Nelze získat ID města');
        const cityIDData = await cityIDResponse.json();

        const weatherResponse = await fetch(`https://weatherappf0xy3u.glitch.me/weather?city=${encodeURIComponent(ipData.city)}`);
        if (!weatherResponse.ok) throw new Error('Nelze získat data o počasí');
        const weatherData = await weatherResponse.json();
        console.log("Počasí:", weatherData);

        //Update the page
        //Updating the top part of the page
        document.getElementById('topCity').innerText = `${weatherData.city}, ${weatherData.country}`;
        document.getElementById('topTemp').innerText = `${Math.round(weatherData.temperature)}°`;
        //Updating data in the middle part
        selectTime(new Date().getHours())
        document.querySelector(`.dayTemps`).innerText = `Den: ${Math.round(weatherData.futureTemp[dayConst].main.temp)}°`
        document.querySelector(`.nightTemps`).innerText = `Noc: ${Math.round(weatherData.futureTemp[nightConst].main.temp)}°`
        //Updating data in todays weather
        //Update of the weather icon
        document.getElementById(`weatherStatMorning`).src = `./svgs/${checkSvgId(weatherData.futureTemp[morningConst].weather[0].icon)}.svg`
        document.getElementById(`weatherStatAfternoon`).src = `./svgs/${checkSvgId(weatherData.futureTemp[dayConst].weather[0].icon)}.svg`
        document.getElementById(`weatherStatEvening`).src = `./svgs/${checkSvgId(weatherData.futureTemp[eveningConst].weather[0].icon)}.svg`
        document.getElementById(`weatherStatNight`).src = `./svgs/${checkSvgId(weatherData.futureTemp[nightConst].weather[0].icon)}.svg`
        //Update of temps
        document.querySelector(`.temperature.morning`).innerText = `${Math.round(weatherData.futureTemp[morningConst].main.temp)}°`
        document.querySelector(`.temperature.afternoon`).innerText = `${Math.round(weatherData.futureTemp[dayConst].main.temp)}°`
        document.querySelector(`.temperature.evening`).innerText = `${Math.round(weatherData.futureTemp[eveningConst].main.temp)}°`
        document.querySelector(`.temperature.night`).innerText = `${Math.round(weatherData.futureTemp[nightConst].main.temp)}°`
        //Update of humadity
        rainProbUpdator(weatherData.futureTemp[morningConst].pop, 'morning')
        rainProbUpdator(weatherData.futureTemp[dayConst].pop, 'afternoon')
        rainProbUpdator(weatherData.futureTemp[eveningConst].pop, 'evening')
        rainProbUpdator(weatherData.futureTemp[nightConst].pop, 'night')
    } catch (error) {
        console.error('Chyba:', error.message);
        document.getElementById('topCity').innerText = 'Chyba při načítání';
        document.getElementById('topTemp').innerText = '--°';
    }
}

getCityByIP();