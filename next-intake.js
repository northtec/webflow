'use strict';
function nextIntake() {
  const now = Date.now();

  const formatDate = function (date) {
    const intakeDate = new Date(date);
    const intakeDateString = intakeDate.toLocaleDateString('en-nz', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return intakeDateString;
  };

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

    const nextDate = arr
      .map((acc) => new Date(acc))
      .filter((date) => date > now)
      .sort((a, b) => a - b);

    const formattedDate = nextDate[0].toLocaleDateString('en-nz', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formattedDate;
  }

  function setRollingText(date) {
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
          return nextDateRolling;
        }
      } else {
        return nextDateRolling;
      }
    }
  }

  const courseCollection = document.querySelectorAll('.course-collection');
  courseCollection.forEach((course) => {
    const dateContainer = course.querySelector(
      '.card-bottom > .next-intake-text'
    );

    const intakerolling = course.querySelectorAll(
      '.next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
    );
    if (intakerolling.length) {
      const intakes = Array.from(
        intakerolling,
        (roll) => roll.textContent
      ).join(', ');

      dateContainer.textContent = nextRollingDate(intakes);
      return;
    }

    const intake = course.querySelector(
      '.next-intake:not(.w-condition-invisible)'
    );
    if (intake) {
      const date = intake.textContent;
      dateContainer.textContent = isDate(date) ? formatDate(date) : date;
    }

    const intakelocation = course.querySelector(
      '.next-intake-location:not(.w-condition-invisible)'
    );
    if (intakelocation) {
      dateContainer.textContent = intakelocation.textContent;
      return;
    }

    const nointake = course.querySelector(
      '.no-intake-set div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
    );
    if (nointake) {
      dateContainer.textContent = nointake.textContent;
      return;
    }
  });
}

nextIntake();
