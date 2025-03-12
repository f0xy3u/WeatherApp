// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.set('trust proxy', true);

app.use(cors(origin = 'https://f0xy3u.github.io/WeatherApp/'));
const port = 3000;


// Tvůj API klíč od OpenWeather
const apiKeyWeather = 'instert_API_key_here';
const apiKeyIP = 'insert API key here';


function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Endpoint pro získání počasí na základě města
app.get('/serverCheck', (req, res) => {
    res.json({message: 'Server běží'});
});

app.get('/ip', async (req, res) => {
    try {
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0] 
            || req.headers['x-real-ip']
            || req.ip.replace('::ffff:', '')
            || '127.0.0.1';
        
        const response = await axios.get(`https://ipinfo.io/${clientIP}`, {
            params: {
                token: apiKeyIP
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/cityID', async (req, res) => {
    const cityName = req.query.city;
    
    if (!cityName) {
        return res.status(400).json({ error: 'Missing city parameter' });
    }

    try {
        const city = removeDiacritics(cityName);
        const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
            params: {
                q: city,
                limit: 1,
                appid: apiKeyWeather
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;

    try {
        let coordinates;
        let normalizedCity;
        let geoResponse;
        
        if (city) {
            const normalizedCity = removeDiacritics(city);
            const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
                params: {
                    q: normalizedCity,
                    limit: 1,
                    appid: apiKeyWeather
                }
            });

            if (!geoResponse.data.length) {
                return res.status(404).json({ error: 'Město nenalezeno' });
            }

            coordinates = {
                lat: geoResponse.data[0].lat,
                lon: geoResponse.data[0].lon
            };
        } else if (lat && lon) {
            coordinates = { lat, lon };
        } else {
            return res.status(400).json({ error: 'Chybí město nebo souřadnice' });
        }

        const weather = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: coordinates.lat,
                lon: coordinates.lon,
                appid: apiKeyWeather,
                units: 'metric',
                lang: 'cs'
            }
        });

        const forecast = await axios.get('https://api.openweathermap.org/data/2.5/forecast/hourly', {
            params: {
                id: normalizedCity,
                lat: coordinates.lat,
                lon: coordinates.lon,
                appid: apiKeyWeather,
                units: 'metric',
                lang: 'cs'
            }
        });

        res.json({
            city: weather.data.name,
            temperature: weather.data.main.temp,
            description: weather.data.weather[0].description,
            country: weather.data.sys.country,
            futureTemp: forecast.data.list
        });

    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ error: 'Chyba při získávání počasí' });
    }
});

app.get('/dailyForecast', async (req, res) => {
    const { city, lat, lon } = req.query;

    let coordinates;
    let normalizedCity;
    let geoResponse;
    
    if (city) {
        const normalizedCity = removeDiacritics(city);
        const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
            params: {
                q: normalizedCity,
                limit: 1,
                appid: apiKeyWeather
            }
        });

        if (!geoResponse.data.length) {
            return res.status(404).json({ error: 'Město nenalezeno' });
        }

        coordinates = {
            lat: geoResponse.data[0].lat,
            lon: geoResponse.data[0].lon
        };
    } else if (lat && lon) {
        coordinates = { lat, lon };
    } else {
        return res.status(400).json({ error: 'Chybí město nebo souřadnice' });
    }

    const weather = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            lat: coordinates.lat,
            lon: coordinates.lon,
            appid: apiKeyWeather,
            units: 'metric',
            lang: 'cs'
        }
    });

    const forecast = await axios.get('https://api.openweathermap.org/data/2.5/forecast/daily', {
        params: {
            lat: coordinates.lat,
            lon: coordinates.lon,
            appid: apiKeyWeather,
            units: 'metric',
            lang: 'cs'
        }
    });

    res.json({
        city: weather.data.name,
        temperature: weather.data.main.temp,
        description: weather.data.weather[0].description,
        country: weather.data.sys.country,
        futureTemp: forecast.data.list
    });
});

// Single server initialization at the end of the file
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

const server = app.listen(port, () => {
    console.log(`Server běží na portu ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} je již používán. Zkuste jiný port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});