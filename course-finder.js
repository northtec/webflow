'use strict';

function normaliseAccents() {
  const regex = /([a-zA-Z]*[\u00c1-\u036f]+[a-zA-Z]*)/gi;
  const nodeList = document.querySelectorAll('.course-collection');
  for (let i = 0, j = nodeList.length; i < j; i++) {
    let textContent = nodeList[i].innerText;
    let accented = textContent.match(regex);
    if (accented) {
      let result = accented
        .join(' ')
        .normalize('NFD')
        .replace(/[\u00c1-\u036f]/g, '');
      nodeList[i].querySelector('[fs-cmsfilter-field="accents"]').innerText =
        result;
    }
  }
}
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    normaliseAccents();
    // scripts to execute in order
    let scripts = [
      'https://cdn.jsdelivr.net/gh/northtec/webflow@1.7.27/next-intake.min.js',
      'https://cdn.jsdelivr.net/npm/@finsweet/attributes-richtext@1/richtext.js',
      'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js',
    ];

    scripts.forEach(function (url) {
      let script = document.createElement('script');
      script.src = url;
      script.async = false;
      document.body.appendChild(script);
    });

    const [listInstance] = listInstances;
    listInstance.on('renderitems', (renderedItems) => {
      if (window.fsAttributes.cmsfilter) {
        const urlParams = new URLSearchParams(window.location.search);
        const area = urlParams.get('area');
        const term = urlParams.get('*');
        const networkProgrammes = document.querySelectorAll(
          '.network-programmes .w-dyn-item'
        );
        let results = 0;
        for (let i = 0; i < networkProgrammes.length; i++) {
          const networkArea = networkProgrammes[i].querySelector(
            '[fs-cmsfilter-field="Area"]'
          );
          const networkText = networkProgrammes[i].textContent.toLowerCase();
          if (
            networkArea.textContent === area ||
            networkText.includes(term?.toLowerCase())
          ) {
            networkProgrammes[i].classList.remove('hidden');
            results++;
          } else {
            networkProgrammes[i].classList.add('hidden');
          }
        }
        results
          ? document
              .querySelector('.network-programmes')
              .classList.remove('hidden')
          : document
              .querySelector('.network-programmes')
              .classList.add('hidden');
      }
    });
  },
]);
