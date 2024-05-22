'use strict';

function loadintakes() {
  const courseCollection = document.querySelectorAll('.course-collection');
  const now = Date.now();
  //Rolling Intakes - Change format and filter old dates
  const isDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const regex2 =
      /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),\s+(\d{4})/;
    if (!regex.test(date) && !regex2.test(date)) return false;
    return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
  };

  function nextRollingDate(intakeDates) {
    const arr = intakeDates.split(', ');
    let datesArray = arr.map((dateString) => {
      if (!isDate(dateString)) return dateString;
      const validDate = new Date(dateString);
      if (validDate < now) return;
      return validDate.toLocaleDateString('en-nz', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    });
    console.log(datesArray);
    const nextDate = datesArray[0];
    if (nextDate) {
      console.log(nextDate);
      return nextDate;
    }
  }

  for (let i = 0; i < courseCollection.length; i++) {
    const intake = courseCollection[i].querySelector(
      '.next-intake:not(.w-condition-invisible)'
    );
    const intakerolling = courseCollection[i].querySelector(
      '.next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
    );
    const intakelocation = courseCollection[i].querySelector(
      '.next-intake-location:not(.w-condition-invisible)'
    );
    const nointake = courseCollection[i].querySelector(
      '.no-intake-set div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
    );
    const datenode = courseCollection[i].querySelector(
      '.card-bottom > .next-intake-text'
    );
    let date = datenode.textContent;

    if (intake) {
      date = intake.textContent;
      if (isDate(date)) {
        const intakeDate = new Date(date);
        const intakeDateString = intakeDate.toLocaleDateString('en-nz', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        date = intakeDateString;
      }

      if (intakerolling) {
        const rollingIntakes = courseCollection[i].querySelectorAll(
          '.next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
        );
        let dates = intakerolling.textContent;
        for (let i = 1; i < rollingIntakes.length; i++) {
          dates = dates + ', ' + rollingIntakes[i].textContent;
        }
        const nextDateRolling = nextRollingDate(dates);
        if (nextDateRolling) {
          if (isDate(date)) {
            console.log(date);
            const nextDate = new Date(date);
            if (nextDate > nextDateRolling) {
              date = nextDateRolling;
            }
          } else {
            date = nextDateRolling;
          }
        }
      }
    } else if (intakerolling) {
      const rollingIntakes = courseCollection[i].querySelectorAll(
        '.next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
      );
      let dates = intakerolling.textContent;
      for (let i = 1; i < rollingIntakes.length; i++) {
        dates = dates + ', ' + rollingIntakes[i].textContent;
      }
      const nextDateRolling = nextRollingDate(dates);
      if (nextDateRolling) {
        date = nextDateRolling;
      } else {
        date = courseCollection[i].querySelector(
          '.next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
        )?.textContent;
      }
    } else if (intakelocation) {
      date = intakelocation.textContent;
    } else if (nointake) {
      date = nointake.textContent;
    }

    datenode.textContent = date;
  }
}
function normaliseAccents() {
  const regex = /([a-zA-Z]*[\u00c1-\u036f]+[a-zA-Z]*)/gi;
  const nodeList = document.querySelectorAll('.course-collection');
  for (let i = 0, j = nodeList.length; i < j; i++) {
    let textContent = nodeList[i].innerText;
    let accented = textContent.match(regex);
    if (accented) {
      let result = accented
        .join(' ')
        .normalize('NFD')
        .replace(/[\u00c1-\u036f]/g, '');
      nodeList[i].querySelector('[fs-cmsfilter-field="accents"]').innerText =
        result;
    }
  }
}
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    loadintakes();
    normaliseAccents();
    // scripts to execute in order
    let scripts = [
      'https://cdn.jsdelivr.net/npm/@finsweet/attributes-richtext@1/richtext.js',
      'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js',
    ];

    scripts.forEach(function (url) {
      let script = document.createElement('script');
      script.src = url;
      script.async = false;
      document.body.appendChild(script);
    });

    const [listInstance] = listInstances;
    listInstance.on('renderitems', (renderedItems) => {
      if (window.fsAttributes.cmsfilter) {
        const urlParams = new URLSearchParams(window.location.search);
        const area = urlParams.get('area');
        const term = urlParams.get('*');
        const networkProgrammes = document.querySelectorAll(
          '.network-programmes .w-dyn-item'
        );
        let results = 0;
        for (let i = 0; i < networkProgrammes.length; i++) {
          const networkArea = networkProgrammes[i].querySelector(
            '[fs-cmsfilter-field="Area"]'
          );
          const networkText = networkProgrammes[i].textContent.toLowerCase();
          if (
            networkArea.textContent === area ||
            networkText.includes(term?.toLowerCase())
          ) {
            networkProgrammes[i].classList.remove('hidden');
            results++;
          } else {
            networkProgrammes[i].classList.add('hidden');
          }
        }
        results
          ? document
              .querySelector('.network-programmes')
              .classList.remove('hidden')
          : document
              .querySelector('.network-programmes')
              .classList.add('hidden');
      }
    });
  },
]);
