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

  const isValidDate = function (dateStr) {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const isDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const regex2 =
      /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),\s+(\d{4})/;
    if (!regex.test(date) && !regex2.test(date)) return false;
    return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
  };

  function nextDate(intakeDates) {
    const arr = intakeDates.split(',').map((d) => d.trim());
    if (!arr.every(isValidDate)) {
      if (arr.includes('Monthly Intakes')) return 'Monthly Intakes';
      return arr[0];
    }

    const dates = arr
      .map((acc) => new Date(acc))
      .filter((date) => date > now)
      .sort((a, b) => a - b);

    const formattedDate = dates[0]?.toLocaleDateString('en-nz', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formattedDate;
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

      dateContainer.textContent = nextDate(intakes);
      return;
    }

    const intake = course.querySelectorAll(
      '.next-intake:not(.w-condition-invisible)'
    );

    const intakelocation = course.querySelector(
      '.next-intake-location:not(.w-condition-invisible)'
    );

    const nointake = course.querySelector(
      '.no-intake-set div:not(.w-condition-invisible):not(.w-dyn-bind-empty)'
    );

    if (intake.length) {
      const dates = Array.from(intake, (intake) => intake.textContent);
      const formattedDates = dates.map((date) => formatDate(date)).join(', ');
      const nextText = nextDate(formattedDates);

      dateContainer.textContent = nextText || 'Starting now';
      return;
    }

    if (intakelocation) {
      dateContainer.textContent = intakelocation.textContent;
      return;
    }

    if (nointake) {
      dateContainer.textContent = nointake.textContent;
      return;
    }
  });
}

nextIntake();
