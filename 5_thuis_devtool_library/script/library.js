'use strict';

/* Deze genereert een error als er een header wordt meegestuurd met de fetch */

const handleData = function (url, callbackFunctionName, callbackErrorFunctionName = null, method = 'GET', body = null) {
  fetch(url, {
    method: method,
    body: body,
    // headers: {
    //   'content-type': 'application/json'
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
    console.log(`Aantal gevonden boeken: ${jsonObject.docs.length}`);
    const alleDocs = jsonObject.docs;
    for (let doc of alleDocs) {
      console.log(`Titel en ondertitel: ${doc.title}`);
      console.log(`Boek gaat over`);
      if (doc.subject) {
        for (let subject of doc.subject) {
          console.log(`->${subject}`);
        }
      } else {
        console.log('--- GEEN ONDERWERPEN BESCHIKBAAR ---');
      }
      console.log('***********');
    }
  } catch (error) {
    console.log('fout bij opbouw console');
  }
};

const getData = function (url) {
  handleData(url, showData);
};

const init = function () {
  console.info('loaded');
  const url = 'http://openlibrary.org/search.json?q=keuken';

  getData(url);
};

document.addEventListener('DOMContentLoaded', init);
