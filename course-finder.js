function loadintakes() {
  $(".course-collection").each(function () {
    var intake = $(this)
      .find(".next-intake:not(.w-condition-invisible)")
      .first();
    var intakerolling = $(this)
      .find(
        ".next-intake-rolling:not(.w-condition-invisible) div:not(.w-condition-invisible):not(.w-dyn-bind-empty)"
      )
      .first();
    var intakelocation = $(this)
      .find(".next-intake-location:not(.w-condition-invisible)")
      .first();
    var nointake = $(this)
      .find(
        ".no-intake-set div:not(.w-condition-invisible):not(.w-dyn-bind-empty)"
      )
      .first();
    var date = $(this).find(".card-bottom > .next-intake-text").text();
    const datenode = $(this).find(".card-bottom > .next-intake-text");

    //Rolling Intakes - Change format and filter old dates
    const isDate = (date) => {
      return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
    };

    if (intake.length) {
      date = intake.text();
      if (isDate(date)) {
        const intakeDate = new Date(date);
        const intakeDateString = intakeDate.toLocaleDateString("en-nz", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        date = intakeDateString;
      }

      if (intakerolling.length) {
        //date = intakerolling.text();
        const nextDateRolling = nextRollingDate(intakerolling.text());

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
    } else if (intakerolling.length) {
      const nextDateRolling = nextRollingDate(intakerolling.text());
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
    } else if (intakelocation.length) {
      date = intakelocation.text();
    } else if (nointake.length) {
      date = nointake.text();
    }

    $(this).find(".card-bottom > .next-intake-text").text(date);
  });

  function nextRollingDate(intakeDates) {
    let date = intakeDates;
    const arr = intakeDates.split(", ");
    let datesArray = arr.map((dateString) => new Date(dateString));
    //console.log(datesArray);
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

  /*  let dates = document.querySelectorAll(".js-rolling-dates");
  for (let i = 0, len = dates.length; i < len; i++) {
    let date = dates[i].innerHTML;
    const arr = date.split(", ");
    let datesArray = arr.map((dateString) => new Date(dateString));
    if (datesArray != "Invalid Date") {
      const now = Date.now();
      const futureDates = datesArray.filter((date) => {
        // Filter out dates in the past or falsey values
        return date && date > now;
      });
      const formatted = futureDates.map((date) =>
        date.toLocaleDateString("en-nz", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
      let FutureDateString = formatted.join(", ");

      if (dates[i].classList.contains("next-intake-text")) {
        FutureDateString = formatted[0];
      }

      if (FutureDateString) {
        dates[i].innerHTML = FutureDateString;
      } else {
        dates[i].innerHTML = new Date().getFullYear() + 1;
      }
    }
  } */
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
