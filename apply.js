"use strict";

const initreferrer = document.referrer;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const otc = urlParams.get("otc");
const ote = urlParams.get("ote");
const pid = urlParams.get("pid");
const programme = urlParams.get("programme");
const progref = urlParams.get("progref");

const target = document.querySelector(".course-chosen-info");

if (initreferrer.indexOf("northtec.ac.nz") !== -1) {
  document.getElementById("referrer").value = initreferrer;
}

const qualField = document.getElementById("Qualification");
const locationField = document.getElementById("Location");
const startField = document.getElementById("Start-Date");
const oteField = document.getElementById("OteUid");
const otcField = document.getElementById("OtcUid");
const qualWrap = document.getElementById("qualification");
const locationWrap = document.getElementById("location");
const startWrap = document.getElementById("intakedates");
const manualEntry = document.querySelector(
  ".manual-checkbox > .js-form-control-section"
);
const manualEntryBtn = document.getElementById("ManualEntryBtn");

const intake =
  document.querySelector(`.intake-codes[data-otc="${otc}"]`) ||
  document.querySelector(`.intake-codes[data-ote="${ote}"]`);

manualEntryBtn.addEventListener("click", function () {
  qualField.readOnly = false;
  locationField.readOnly = false;
  startField.readOnly = false;
  document.getElementById("ManualEntry").click();
  if (oteField) oteField.value = "99999999";
  if (otcField) otcField.value = "99999999";
  this.classList.add("hidden");
});

if (intake) {
  target.innerHTML = intake.closest(".w-dyn-item").innerHTML;
  qualField.value = intake.innerText;
  locationField.value = intake.dataset.location;
  startField.value = intake.dataset.startDate;
  qualField.readOnly = true;
  locationField.readOnly = true;
  startField.readOnly = true;
  qualWrap.classList.remove("hidden");
  locationWrap.classList.remove("hidden");
  startWrap.classList.remove("hidden");
  if (ote) oteField.value = ote;
  if (otc) otcField.value = otc;
  manualEntry.dataset.required = "false";
} else if (programme) {
  qualField.value = programme;
  target.classList.add("hidden");
  qualWrap.classList.remove("hidden");
  locationWrap.classList.remove("hidden");
  startWrap.classList.remove("hidden");
  qualWrap.dataset.required = "true";
  locationWrap.dataset.required = "true";
  startWrap.dataset.required = "true";
  manualEntryBtn.click();
}

$(function () {
  $(".w-tab-link").removeClass("w--current");
  $(".w-tab-pane").removeClass("w--tab-active");

  $(".w-tab-link:nth-child(1)").addClass("w--current");
  $(".w-tab-pane:nth-child(1)").addClass("w--tab-active");

  var prev = $(".previous-btn");
  var next = $(".next-btn");

  $(prev).on("click", function () {
    $(".w-tab-link.w--current").prev(".w-tab-link").trigger("click");
  });
  $(next).on("click", function () {
    $(".w-tab-link.w--current").next(".w-tab-link").trigger("click");
  });
});

const inputChanged = function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "formStart",
  });
};

document
  .querySelector('.form-control-wrapper input[data-name="Email"]')
  .addEventListener("change", inputChanged, { once: true });
