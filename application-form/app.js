'use strict';
import 'core-js/stable';

const setReferrer = function () {
  const referrer = document.referrer;
  if (!referrer.includes('northtec.ac.nz')) return;
  document.getElementById('referrer').value = referrer;
};

const isDate = date => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const regex2 =
    /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),\s+(\d{4})/;
  if (!regex.test(date) && !regex2.test(date)) return false;
  return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
};

function nextDate(intakeDates) {
  const now = Date.now();
  const arr = intakeDates.split(', ');
  if (!isDate(arr[0])) return false;

  const dates = arr
    .map(acc => new Date(acc))
    .filter(date => date > now)
    .sort((a, b) => a - b);

  const formattedDate = dates[0]?.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return formattedDate;
}

const setFormSource = function () {
  const sourceInput = document.getElementById('formSource');
  if (sourceInput) {
    sourceInput.value = window.location.hostname;
  }
};

const setStudyPreference = function (studytype) {
  if (!studytype) return;
  const inputFullTime = document.getElementById('Full-time');
  const inputPartTime = document.getElementById('Part-time');
  const descriptorField = document.querySelector(
    '#studyPreference .descriptor'
  );

  if (studytype === 'Full Time') {
    inputFullTime.click();
    descriptorField.textContent = 'Note: This course may be full-time only.';
  }
  if (studytype === 'Part Time') {
    inputPartTime.click();
    descriptorField.textContent = 'Note: This course may be part-time only.';
  }
};

const prefillFormFromURL = function () {
  // Get URL Parameters
  const queryString = window.location.search;
  if (!queryString) return;

  const urlParams = new URLSearchParams(queryString);
  const otc = urlParams.get('otc');
  const ote = urlParams.get('ote');
  const eid = urlParams.get('eid');
  const studytype = urlParams.get('studytype');
  const programme = urlParams.get('programme');

  const target = document.querySelector('.course-chosen-info');
  const qualField = document.getElementById('Qualification');
  const locationField = document.getElementById('Location');
  const startField = document.getElementById('Start-Date');
  const oteField = document.getElementById('OteUid');
  const otcField = document.getElementById('OtcUid');
  const qualWrap = document.getElementById('qualification');
  const locationWrap = document.getElementById('location');
  const startWrap = document.getElementById('intakedates');
  const manualEntry = document.querySelector(
    '.manual-checkbox > .js-form-control-section'
  );

  const intake =
    document.querySelector(
      `.intake-codes[data-otc="${otc}"][data-pid="${eid}"]`
    ) ||
    document.querySelector(`.intake-codes[data-otc="${otc}"]`) ||
    document.querySelector(
      `.intake-codes[data-ote="${ote}"][data-pid="${eid}"]`
    ) ||
    document.querySelector(`.intake-codes[data-ote="${ote}"]`);

  if (intake) {
    target.innerHTML = intake.closest('.w-dyn-item').innerHTML;
    qualField.value = intake.innerText;
    locationField.value =
      intake.dataset.locationCustom || intake.dataset.location;
    startField.value =
      nextDate(intake.dataset.rollingDescription) ||
      intake.dataset.startDate ||
      'Next Intake';
    qualField.readOnly = true;
    locationField.readOnly = true;
    startField.readOnly = true;
    const intakeName = intake.innerText.toLowerCase();
    if (intakeName.includes('part time') || intakeName.includes('part-time'))
      setStudyPreference('Part Time');
    else if (
      intakeName.includes('full time') ||
      intakeName.includes('full-time')
    )
      setStudyPreference('Full Time');
    else setStudyPreference(intake.dataset.options);
    qualWrap.classList.remove('hidden');
    locationWrap.classList.remove('hidden');
    startWrap.classList.remove('hidden');
    if (ote) oteField.value = ote;
    if (otc) otcField.value = otc;
    manualEntry.dataset.required = 'false';
  } else if (programme) {
    manualClick();
    qualField.value = programme;
    setStudyPreference(studytype);
  }
};

const inputChanged = function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'formStart',
  });
};

const addFormStartedListener = function () {
  const emailField = document.querySelector(
    '.form-control-wrapper input[data-name="Email"]'
  );
  emailField.addEventListener('change', inputChanged, { once: true });
};

const resetToFirstTab = function () {
  const firstTab = document.querySelector('.w-tab-link');
  const siblings = firstTab
    .closest('.w-tab-menu')
    .querySelectorAll('.w-tab-link');
  if (firstTab.classList.contains('w--current')) return;
  siblings.forEach(el => el.classList.remove('w--current'));
  firstTab.classList.add('w--current');
};

const addPrevNextListeners = function () {
  document.querySelector('.tab-nav').addEventListener('click', function (e) {
    const currTab = document.querySelector('.w-tab-link.w--current');
    if (e.target.classList.contains('previous-btn')) {
      currTab.previousElementSibling?.click();
    }
    if (e.target.classList.contains('next-btn')) {
      currTab.nextElementSibling?.click();
    }
  });
};

const manualClick = function () {
  const oteField = document.getElementById('OteUid');
  const otcField = document.getElementById('OtcUid');

  document.getElementById('ManualEntry').click();
  document.getElementById('ManualEntryBtn').classList.add('hidden');
  document.querySelector('.course-chosen-info').classList.add('hidden');
  document
    .querySelectorAll('#manual-entry .w-input')
    .forEach(el => (el.readOnly = false));
  if (oteField) oteField.value = '99999999';
  if (otcField) otcField.value = '99999999';
};

const addManualEntryBtnEventListener = function () {
  document
    .getElementById('ManualEntryBtn')
    .addEventListener('click', manualClick);
};

const replaceEmail = function (e) {
  const el = e.target;
  if (!el.classList.contains('replaceEmail')) return;
  e.preventDefault();
  el.closest('.form-control').querySelector('input[data-name="Email"]').value =
    el.dataset.email;
  el.closest('.warning').remove();
};

const init = function () {
  //setReferrer();
  addFormStartedListener();
  addManualEntryBtnEventListener();
  resetToFirstTab();
  addPrevNextListeners();
  prefillFormFromURL();
  setFormSource();
};

init();
