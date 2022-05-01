'use strict';
const handleData = function (url, callbackFunctionName, callbackErrorFunctionName = null, method = 'GET', body = null) {
  fetch(url, {
    method: method,
    body: body,
    // headers: {
    //   'content-type': 'application/json',
    // },
  })
    .then(function (response) {
      if (!response.ok) {
        console.warn(`>> Probleem bij de fetch(). Statuscode: ${response.status}`);
        if (callbackErrorFunctionName) {
          console.warn(`>> Callback errorfunctie ${callbackErrorFunctionName.name}(response) wordt opgeroepen`);
          callbackErrorFunctionName(response);
        } else {
          console.warn('>> Er is geen callback errorfunctie meegegeven als parameter');
        }
      } else {
        console.info('>> Er is een response teruggekomen van de server');
        return response.json();
      }
    })
    .then(function (jsonObject) {
      if (jsonObject) {
        console.info('>> JSONobject is aangemaakt');
        console.info(`>> Callbackfunctie ${callbackFunctionName.name}(response) wordt opgeroepen`);
        callbackFunctionName(jsonObject);
      }
    })
    .catch(function (error) {
      console.warn(`>>fout bij verwerken json: error`);
      if (callbackErrorFunctionName) {
        callbackErrorFunctionName(undefined);
      }
    });
};

const vertaalDagNummerNaarTekst = function (dagNr) {
  if (dagNr === 0) {
    return 'zondag';
  } else if (dagNr === 1) {
    return 'maandag';
  } else if (dagNr === 2) {
    return 'dinsdag';
  } else if (dagNr === 3) {
    return 'woensdag';
  } else if (dagNr === 4) {
    return 'donderdag';
  } else if (dagNr === 5) {
    return 'vrijdag';
  } else if (dagNr === 6) {
    return 'zaterdag';
  }
};

const showWeather = function (jsonObject) {
  try {
    console.log(jsonObject);
    document.querySelector('.js-city-placeholder').innerHTML = `${jsonObject.city.name} (${jsonObject.city.country})`;

    //overloop onze voorspelling maar verspring steeds 8 voorspelling (per 3uur)
    const arrAlleVoorspellingen = jsonObject.list;
    let stringHTML = '';
    for (let i = 0; i < arrAlleVoorspellingen.length; i += 8) {
      //gebruik de index [i] om 1 object uit de array te halen
      const dagVoorspelling = arrAlleVoorspellingen[i];
      //maak een Date object aan
      const datumUTCFormaat = dagVoorspelling.dt;
      const dag = new Date(datumUTCFormaat * 1000);
      const dagNummer = dag.getDay();
      const dagNaam = vertaalDagNummerNaarTekst(dagNummer);
      const maxTemp = dagVoorspelling.main.temp_max;
      const minTemp = dagVoorspelling.main.temp_min;
      const omschrijving = dagVoorspelling.weather[0].description;
      stringHTML += `<div class="c-forecast">
      <div class="c-forecast__datum">${dagNaam}</div>
      <div class="c-forecast__symbol">
        <img src="images/weather/wi-day-sunny.svg" alt="Onweer" />
      </div>
      <div class="c-forecast__uitleg">${omschrijving}</div>
      <div class="c-forecast__max">${maxTemp}°C</div>
      <div class="c-forecast__min">${minTemp}°C</div>
    </div>`;
      console.log(dagNaam);
      //console.log(dagNummer);
      //console.log(dagVoorspelling);
    }
    document.querySelector('.js-weather-placeholder').innerHTML = stringHTML;
  } catch (error) {
    console.error(`oeps ${error}`);
  }
};

const getData = function (url) {
  handleData(url, showWeather);
};

const init = function () {
  console.info('loaded');
  const url = 'https://api.openweathermap.org/data/2.5/forecast?q=kortrijk,BE&appid=ba1cb9701b941bb25e28e4f74cabc55a&units=metric&lang=nl';

  getData(url);
};

document.addEventListener('DOMContentLoaded', init);
