var page = tabris.create("Page", {
  title: "ActivityIndicator",
  topLevel: true
});

// Create the activity indicator centered in the page
var activityIndicator = tabris.create("ActivityIndicator", {
  centerX: 0,
  centerY: 0
}).appendTo(page);

// Create reload button
var reloadButton = tabris.create("Button", {
  layoutData: {centerX: 0, centerY: 0},
  text: "Run Task"
}).on("select", function() {
  executeLongRunningTask();
}).appendTo(page);

function executeLongRunningTask() {
  // Toggle visibiliy of elements
  activityIndicator.set("visible", true);
  reloadButton.set("visible", false);

  setTimeout(function() {
    // Async action is done
    activityIndicator.set("visible", false);
    reloadButton.set("visible", true);
  }, 2500);
}

executeLongRunningTask();

page.open();

