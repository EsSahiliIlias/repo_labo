'use strict';

const handleData = function (url, callbackFunctionName, callbackErrorFunctionName = null, method = 'GET', body = null) {
  fetch(url, {
    method: method,
    body: body,
    headers: {
      'content-type': 'application/json',
    },
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

const zeroToSreepke = function (getal) {
  if (getal === 0) {
    return '--';
  } else {
    return getal;
  }
};

const showAfvelCOntainers = function (jsonObject) {
  //toon in de console de verschillende straatnamen
  try {
    const arrAlleContainers = jsonObject.features;
    let htmlstring = '';
    for (let straat of arrAlleContainers) {
      const straatNaam = zeroToSreepke(straat.properties.STRAATNAAM);
      const aantalGFT = zeroToSreepke(straat.properties.AANTAL_CNTR_GFT);
      const aantalGlas = zeroToSreepke(straat.properties.AANTAL_CNTR_GLAS);
      const aantalPMD = zeroToSreepke(straat.properties.AANTAL_CNTR_PMD);
      const aantalRest = zeroToSreepke(straat.properties.AANTAL_CNTR_REST);
      const aantalPapier = zeroToSreepke(straat.properties.AANTAL_CNTR_PK);
      htmlstring += ` <article class="c-locatie">
        <h2 class="c-locatie__adres">${straatNaam}</h2>
        <div class="c-locatie__info">
          <div class="c-locatie__type">
            GFT
            <div class="c-locatie__aantal">${aantalGFT}</div>
          </div>
          <div class="c-locatie__type">
            GLAS
            <div class="c-locatie__aantal">${aantalGlas}</div>
          </div>
          <div class="c-locatie__type">
            PMD
            <div class="c-locatie__aantal">${aantalPMD}</div>
          </div>
          <div class="c-locatie__type">
            REST
            <div class="c-locatie__aantal">${aantalRest}</div>
          </div>
          <div class="c-locatie__type">
            PAPIER
            <div class="c-locatie__aantal">${aantalPapier}</div>
          </div>
        </div>
      </article>`;
    }
    document.querySelector('.js-placeholder').innerHTML = htmlstring;
  } catch (err) {
    console.error(err);
  }
};

const getDataAfvalContainers = function (url) {
  handleData(url, showAfvelCOntainers);
};

const init = function () {
  console.info('loaded');

  const url = 'https://opendata.arcgis.com/datasets/413c00cfda8743fbb94ce7e7e67d67c7_49.geojson';

  getDataAfvalContainers(url);
};

document.addEventListener('DOMContentLoaded', init);
