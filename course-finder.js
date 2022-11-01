"use strict";

function loadintakes() {
  const courseCollection = document.querySelectorAll(".course-collection");

  const isDate = (date) => {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
  };

  function nextRollingDate(intakeDates) {
    let date = intakeDates;
    const arr = intakeDates.split(", ");
    let datesArray = arr.map((dateString) => new Date(dateString));

    if (datesArray != "Invalid Date") {
      const now = Date.now();
      const futureDates = datesArray.filter((date) => {
        // Filter out dates in the past or falsey values
        return date && date > now;
      });
      const nextDate = futureDates[0];
      if (nextDate) {
        return nextDate;
      }
    }
  }

  for (let i = 0; i < courseCollection.length; i++) {
    const intake = courseCollection[i].querySelector(
      ".next-intake:not(.w-condition-invisible)"
    );
    const intakerolling = courseCollection[i].querySelector(
      ".next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)"
    );
    const intakelocation = courseCollection[i].querySelector(
      ".next-intake-location:not(.w-condition-invisible)"
    );
    const nointake = courseCollection[i].querySelector(
      ".no-intake-set div:not(.w-condition-invisible):not(.w-dyn-bind-empty)"
    );
    const datenode = courseCollection[i].querySelector(
      ".card-bottom > .next-intake-text"
    );
    let date = datenode.textContent;

    if (intake) {
      date = intake.textContent;
      if (isDate(date)) {
        const intakeDate = new Date(date);
        const intakeDateString = intakeDate.toLocaleDateString("en-nz", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        date = intakeDateString;
      }

      if (intakerolling) {
        const rollingIntakes = courseCollection[i].querySelectorAll(
          ".next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)"
        );
        let dates = intakerolling.textContent;
        for (let i = 1; i < rollingIntakes.length; i++) {
          dates = dates + ", " + rollingIntakes[i].textContent;
        }
        const nextDateRolling = nextRollingDate(dates);
        if (nextDateRolling) {
          const nextDateRollingString = nextDateRolling.toLocaleDateString(
            "en-nz",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          );
          if (isDate(date)) {
            const nextDate = new Date(date);
            if (nextDate > nextDateRolling) {
              date = nextDateRollingString;
            }
          } else {
            date = nextDateRollingString;
          }
        }
      }
    } else if (intakerolling) {
      const rollingIntakes = courseCollection[i].querySelectorAll(
        ".next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)"
      );
      let dates = intakerolling.textContent;
      for (let i = 1; i < rollingIntakes.length; i++) {
        dates = dates + ", " + rollingIntakes[i].textContent;
      }
      const nextDateRolling = nextRollingDate(dates);
      if (nextDateRolling) {
        const nextDateRollingString = nextDateRolling.toLocaleDateString(
          "en-nz",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
        date = nextDateRollingString;
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
  const nodeList = document.querySelectorAll(".course-collection");
  for (let i = 0, j = nodeList.length; i < j; i++) {
    let textContent = nodeList[i].innerText;
    let accented = textContent.match(regex);
    if (accented) {
      let result = accented
        .join(" ")
        .normalize("NFD")
        .replace(/[\u00c1-\u036f]/g, "");
      nodeList[i].querySelector('[fs-cmsfilter-field="accents"]').innerText =
        result;
    }
  }
}
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsload",
  (listInstances) => {
    loadintakes();
    normaliseAccents();
    // scripts to execute in order
    let scripts = [
      "https://cdn.jsdelivr.net/npm/@finsweet/attributes-richtext@1/richtext.js",
      "https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js",
    ];

    scripts.forEach(function (url) {
      let script = document.createElement("script");
      script.src = url;
      script.async = false;
      document.body.appendChild(script);
    });
  },
]);
