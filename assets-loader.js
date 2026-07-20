(function () {
  const assets = window.SEEU_ASSETS || {};
  document.querySelectorAll('img[src]').forEach((image) => {
    const embeddedSource = assets[image.getAttribute('src')];
    if (embeddedSource) image.setAttribute('src', embeddedSource);
  });
})();
