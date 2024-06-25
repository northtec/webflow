'use strict';

function nextIntake() {
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
    if (!isDate(arr[0])) return arr[0];

    const nextDate = arr.map((acc) => new Date(acc)).sort((a, b) => a - b);

    const formattedDate = nextDate[0].toLocaleDateString('en-nz', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formattedDate;
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

nextIntake();
