'use strict';
import 'core-js/stable';

const setReferrer = function () {
  const referrer = document.referrer;
  if (!referrer.includes('northtec.ac.nz')) return;
  document.getElementById('referrer').value = referrer;
};

const prefillFormFromURL = function () {
  // Get URL Parameters
  const queryString = window.location.search;
  if (!queryString) return;

  const urlParams = new URLSearchParams(queryString);
  const otc = urlParams.get('otc');
  const ote = urlParams.get('ote');
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
    document.querySelector(`.intake-codes[data-otc="${otc}"]`) ||
    document.querySelector(`.intake-codes[data-ote="${ote}"]`);

  if (intake) {
    target.innerHTML = intake.closest('.w-dyn-item').innerHTML;
    qualField.value = intake.innerText;
    locationField.value = intake.dataset.location;
    startField.value = intake.dataset.startDate;
    qualField.readOnly = true;
    locationField.readOnly = true;
    startField.readOnly = true;
    qualWrap.classList.remove('hidden');
    locationWrap.classList.remove('hidden');
    startWrap.classList.remove('hidden');
    if (ote) oteField.value = ote;
    if (otc) otcField.value = otc;
    manualEntry.dataset.required = 'false';
  } else if (programme) {
    manualClick();
    qualField.value = programme;
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

const init = function () {
  setReferrer();
  addFormStartedListener();
  addManualEntryBtnEventListener();
  resetToFirstTab();
  addPrevNextListeners();
  prefillFormFromURL();
};

init();
