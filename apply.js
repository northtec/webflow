function chosenQual() {
  const initreferrer = document.referrer;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const ote = urlParams.get("ote");
  const pid = urlParams.get("pid");
  const programme = urlParams.get("programme");
  const progref = urlParams.get("progref");

  let target = document.querySelector(".course-chosen-info");

  if (initreferrer.indexOf("northtec.ac.nz") !== -1) {
    document.getElementById("referrer").value = initreferrer;
  }

  if (ote) {
    let prog = document.querySelectorAll(
      '.intake-codes[data-ote="' + ote + '"]'
    );
    let manchex = document.querySelector(
      ".manual-checkbox > .js-form-control-section"
    );
    if (prog.length == 1) {
      prog[0].closest(".w-dyn-item").classList.remove("hidden");
      prog[0].closest(".w-dyn-item").classList.add("chosen-intake");
      prog[0].closest(".prog-item").classList.add("chosen-programme");
      document.getElementById("Qualification").value = document.querySelector(
        ".chosen-programme .prog-name"
      ).innerText;
      document.getElementById("Location").value = document.querySelector(
        ".chosen-programme .chosen-intake .app-location"
      ).innerText;
      document.getElementById("Start-Date").value = document.querySelector(
        ".chosen-programme .chosen-intake .app-start"
      ).innerText;
      document.getElementById("OteUid").value = ote;
      target.innerHTML = prog[0].closest(".prog-item").innerHTML;
      manchex.dataset.required = "false";
    } else {
      var found = document.querySelector(
        '.intake-codes[data-ote="' + ote + '"]'
      );
      for (var i = 0; i < prog.length; i++) {
        const el = prog[i].closest(".prog-item");
        if (el) {
          const pro = el.querySelector(".prog-name").innerText;
          if (pro == progref) {
            found = el.querySelector(".intake-codes");
            break;
          }
        }
      }
      found.closest(".w-dyn-item").classList.remove("hidden");
      found.closest(".w-dyn-item").classList.add("chosen-intake");
      found.closest(".prog-item").classList.add("chosen-programme");
      document.getElementById("Qualification").value = document.querySelector(
        ".chosen-programme .prog-name"
      ).innerText;
      document.getElementById("Location").value = document.querySelector(
        ".chosen-programme .chosen-intake .app-location"
      ).innerText;
      document.getElementById("Start-Date").value = document.querySelector(
        ".chosen-programme .chosen-intake .app-start"
      ).innerText;
      document.getElementById("OteUid").value = ote;
      target.innerHTML = found.closest(".prog-item").innerHTML;
      manchex.dataset.required = "false";
    }
  } else if (pid) {
    let prog = document.querySelector('.prog-codes[data-pid="' + pid + '"]');
    if (prog) {
      prog.closest(".prog-item").classList.add("chosen-programme");
      document.getElementById("Qualification").value = document.querySelector(
        ".chosen-programme .prog-name"
      ).innerText;
      document.getElementById("ManualEntry").click();
    }
  } else if (programme) {
    document.getElementById("Qualification").value = programme;
    document.getElementById("ManualEntry").click();
  }
}

$(function () {
  $(".w-tab-link").removeClass("w--current");
  $(".w-tab-pane").removeClass("w--tab-active");

  $(".w-tab-link:nth-child(1)").addClass("w--current");
  $(".w-tab-pane:nth-child(1)").addClass("w--tab-active");

  $("input#ManualEntry:checkbox").change(function () {
    if ($(this).is(":checked")) {
      $(this).prop("disabled", true);
      $(this).closest("#course-chosen").addClass("hidden");
      $(this).closest(".js-form-control-section");
      document.getElementById("OteUid").value = "99999999";
    }
  });

  var prev = $(".previous-btn");
  var next = $(".next-btn");

  $(prev).on("click", function () {
    $(".w-tab-link.w--current").prev(".w-tab-link").trigger("click");
  });
  $(next).on("click", function () {
    $(".w-tab-link.w--current").next(".w-tab-link").trigger("click");
  });
});

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsload",
  (listInstances) => {
    chosenQual();
  },
]);

const inputChanged = function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "formStart",
  });
};

document
  .querySelector('.form-control-wrapper input[data-name="Email"]')
  .addEventListener("change", inputChanged, { once: true });
