function checkSvgId(id) {
    if (id == `04d` || id == `04n`) {
        return `03d`;
    } else {
        return id;
    }
}

let temperatureElement = document.querySelectorAll('.temperature');
let svgElement = document.querySelectorAll('.weatherStatus');
let moistureElement = document.querySelectorAll('.moisture');

function rainProbUpdator(pop, element) {
    if (pop > 0) {
        //Rounding of pop
        pop = Math.round(pop*10)/10;
        moistureElement[element].childNodes[1].innerText = `${pop}%`
        moistureElement[element].childNodes[0].src = `../svgs/rain.svg`
    } else { 
        moistureElement[element].innerText = '--' 
    };
}

async function getWeather() {
    try{
        const serverCheck = await fetch('https://weatherappf0xy3u.glitch.me/serverCheck');
        if (!serverCheck.ok) throw new Error('Server není dostupný');

        const ipResponse = await fetch('https://weatherappf0xy3u.glitch.me/ip');
        if (!ipResponse.ok) throw new Error('Nelze získat město z IP');
        const ipData = await ipResponse.json();
        console.log("IP data:", ipData);

        const cityIDResponse = await fetch(`https://weatherappf0xy3u.glitch.me/cityID?city=${encodeURIComponent(ipData.city)}`);
        if (!cityIDResponse.ok) throw new Error('Nelze získat ID města');
        const cityIDData = await cityIDResponse.json();
        console.log("City ID:", cityIDData);

        const weatherResponse = await fetch(`https://weatherappf0xy3u.glitch.me/dailyForecast?city=${encodeURIComponent(ipData.city)}`);
        if (!weatherResponse.ok) throw new Error('Nelze získat data o počasí');
        const weatherData = await weatherResponse.json();
        console.log("Počasí:", weatherData);

        //Update the page
        //Updating the top part of the page
        document.getElementById('topCity').innerText = `${weatherData.city}, ${weatherData.country}`;
        document.getElementById('topTemp').innerText = `${Math.round(weatherData.temperature)}°`;

        //Updating temperatures
        let i = 0; //index for counting days in element update
        temperatureElement.forEach(element => {
            element.childNodes[0].innerText = `${Math.round(weatherData.futureTemp[i].temp.max)}°`;
            element.childNodes[2].innerText = `${Math.round(weatherData.futureTemp[i].temp.min)}°`;
            i++;
        });

        //Updating icons
        i = 0; //index for counting days in element update
        svgElement.forEach(element => {
            let id = checkSvgId(weatherData.futureTemp[i].weather[0].icon);
            element.childNodes[0].src = `../svgs/${id}.svg`;
            i++;
        });

        i = 0; //index for counting days in element update
        moistureElement.forEach(element => {
            rainProbUpdator(weatherData.futureTemp[i].pop, i);
            i++;
        });
    } catch (error) {
        console.error('Chyba:', error.message);
        document.getElementById('topCity').innerText = 'Chyba při načítání';
        document.getElementById('topTemp').innerText = '--°';
    }
}

getWeather();