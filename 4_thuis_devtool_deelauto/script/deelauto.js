'use strict';

/* Deze genereert een error als er een header wordt meegestuurd met de fetch */
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

const showData = function (jsonObject) {
  try {
    console.log("**** De volgende auto's zijn beschikbaar****");
    const alleRecords = jsonObject.records;
    for (let record of alleRecords) {
      console.log(`${record.fields.displayname} en is the vinden op lat: ${record.fields.geopoints[0]} long: ${record.fields.geopoints[1]}`);
    }
  } catch (err) {
    console.log('fout bij opbouw console');
  }
};

const getData = function (url) {
  handleData(url, showData);
};

const init = function () {
  console.info('loaded');
  const url = 'https://data.stad.gent/api/records/1.0/search/?dataset=real-time-locaties-deelwagen-partago&q=';

  getData(url);
};

document.addEventListener('DOMContentLoaded', init);
