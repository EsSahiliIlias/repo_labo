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

const showSerie = function (jsonObject) {
  try {
    console.log(`De naam van de serie is: ${jsonObject.name}`);
    console.log(`De uurzending ${jsonObject.schedule.time}`);

    const alleGenres = jsonObject.genres;
    for (let genre of alleGenres) {
      console.log(`- ${genre}`);
    }

    const alleEpisodes = jsonObject._embedded.episodes;
    for (let epi of alleEpisodes) {
      console.log(`- s${epi.season}e${epi.number} - ${epi.name}`);
    }
  } catch (err) {
    console.log(`fout bij opbouw console`);
  }
};

const laadSerieInfo = function (url) {
  console.info(`Op te zoeken URL: ${url} `);
  handleData(url, showSerie);

  //   fetch(url)
  //     .then(function (response) {
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         console.error('Fout met server');
  //       }
  //     })
  //     .then(function (jsonResponseObject) {
  //       console.log(jsonResponseObject);
  //       showSerie(jsonResponseObject);
  //     })
  //     .catch(function (err) {
  //       console.error(`FOUT BIJ OMZETTEN JSON ${err}`);
  //     });
};

const init = function () {
  console.info('loaded');

  const url = 'http://api.tvmaze.com/singlesearch/shows?q=Homeland&embed=episodes';
  laadSerieInfo(url);
};

document.addEventListener('DOMContentLoaded', init);
