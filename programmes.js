'use strict';

//Dynamically set data attributes on each item in collection based on its value
const locations = document.querySelectorAll(
  '.collection-locations .location-item'
);

for (let i = 0, j = locations.length; i < j; i++) {
  const value = locations[i].innerText;
  locations[i].setAttribute('data-attr-item', value);
}

//Rolling Intakes - Change format and filter old dates
const isDate = (date) => {
  return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
};

let dates = document.querySelectorAll('.js-rolling-dates');
for (let i = 0, len = dates.length; i < len; i++) {
  let date = dates[i].innerHTML;
  const arr = date.split(', ');
  let datesArray = arr.map((dateString) => new Date(dateString));
  if (datesArray != 'Invalid Date') {
    const now = Date.now();
    const futureDates = datesArray.filter((date) => {
      // Filter out dates in the past or falsey values
      return date && date > now;
    });
    const formatted = futureDates.map((date) =>
      date.toLocaleDateString('en-nz', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
    const FutureDateString = formatted.join(', ');

    if (FutureDateString) {
      dates[i].innerHTML = FutureDateString;
    } else {
      dates[i].textContent = 'TBC';
    }
  }
}

const metaStart = document
  .querySelector('meta[name="programme-data"]')
  .getAttribute('data-start-placeholder');
const intakeText = document.querySelectorAll(
  '.intake-collection .intake-date > .intake-text'
);

if (metaStart === 'Rolling Intake' && intakeText.length > 0) {
  for (const intake of intakeText) {
    intake.classList.add('hidden');
  }
  const unhideRolling = document.querySelectorAll('.programme-rolling-intake');
  for (const rolling of unhideRolling) {
    rolling.classList.remove('hidden');
  }
}

//Date Range formatting
const dateFormat = new Intl.DateTimeFormat('en-nz', { dateStyle: 'long' });
const dateFormatFull = new Intl.DateTimeFormat('en-nz', { dateStyle: 'full' });

const intakeDates = document.querySelectorAll(
  '.intake-collection .intake-date'
);
intakeDates.forEach(function (intake) {
  const startDate = intake.querySelector('.intake-start-date');
  const endDate = intake.querySelector('.intake-end-date');
  const start =
    isDate(startDate?.textContent) && new Date(startDate?.textContent);
  const end = isDate(endDate?.textContent) && new Date(endDate?.textContent);
  if (!start) return;

  const range =
    start.getTime() === end.getTime()
      ? dateFormatFull.formatRange(start, end)
      : dateFormat.formatRange(start, end);
  if (range) {
    intake.insertAdjacentHTML(
      'beforeend',
      `<div class="intake-text intake-range">${range}</div>`
    );
    startDate.classList.add('hidden');
    endDate.classList.add('hidden');
    intake.querySelector('.seperator').classList.add('hidden');
  }
});

/**
 * Intersectional Observer for the anchor navigation.
 */
const headeroffset = document.querySelector('.course-nav-section').offsetHeight;
var bodyStyles = document.body.style;
bodyStyles.setProperty('--sticky-header-height', headeroffset + 'px');
bodyStyles.setProperty('--sticky-header-margin', '-' + headeroffset + 'px');

const sections = document.querySelectorAll('.anchor-section');
const header = headeroffset + 30;
//sections.style.setProperty('--sticky-header-height', header + 'px');
//sections.style.setProperty('--sticky-header-margin', '-' + header + 'px')
// intersection observer setup
const observerOptions = {
  root: null,
  rootMargin: '-' + header + 'px 0px 0px 0px',
  threshold: 0,
};

function observerCallback(entries, observer) {
  entries.forEach((entry) => {
    // get the nav item corresponding to the id of the section
    const hash = '#' + entry.target.id;
    const navItem = document.querySelector(`a[href="${hash}"]`);
    if (entry.isIntersecting) {
      // add 'active' class on the navItem currently in view
      navItem.classList.add('active');
    } else {
      // remove 'active' class on the navItem not in view
      navItem.classList.remove('active');
    }
  });
}

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach((sec) => observer.observe(sec));

//Separate out Industry intakes
const industryIntakes = document.querySelectorAll(
  '.sp-intake-data[data-intake-industry-training="true"]'
);
industryIntakes.length &&
  document
    .querySelector('.industry-training-wrapper')
    .classList.remove('hidden');

for (let i = 0; i < industryIntakes.length; i++) {
  const intake = industryIntakes[i].closest('.w-dyn-item');
  document.querySelector('.industry-intakes-destination').append(intake);
}
