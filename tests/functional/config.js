define([], function() {
  // These are custom properties that the tests can grab.
  // harViewerBase: The root URL to the harviewer app.
  // testBase: The root URL to the harviewer test pages, HARs and HARPs.

  // We use the .lan suffixin this example to appease Microsoft Edge that doesn't like
  // browsing to single-word local hostname. See:
  // https://social.technet.microsoft.com/Forums/en-US/246298d8-52c1-4440-8d7f-05329d50e653/edge-browser-hosts-file?forum=win10itprogeneral
  return {
    harViewerBase: "http://harviewer.lan:49001/webapp/",
    testBase: "http://harviewer.lan:49001/selenium/",
    findTimeout: 30 * 1000,
  };
});
