const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const taskInput = document.getElementById("taskName");
const tasklist = document.getElementById("listContainer");
const saveButton = document.getElementById("exportTasks");

// Variables to store time values.
let hours = 0;
let minutes = 0;
let seconds = 0;

// Variables to capture start and end time
let startTime;
let endTime;

// Variable to store the interval ID
let timerInterval;

// Function to update the timer
function updateTimer() {
  seconds++;
  if (seconds === 60) {
    seconds = 0;
    minutes++;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }

  // Display the updated timer values
  hoursElement.textContent = hours.toString().padStart(2, "0");
  minutesElement.textContent = minutes.toString().padStart(2, "0");
  secondsElement.textContent = seconds.toString().padStart(2, "0");
}

startButton.addEventListener("click", function () {
  console.log("Add task, timer started.");
  // Start the timer by calling updateTimer every second
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
});

stopButton.addEventListener("click", function () {
  // Stop the timer
  console.log("Timer Stopped, task saved.");
  endTime = new Date();
  clearInterval(timerInterval);

  // Display the updated timer values
  hoursElement.textContent = "00";
  minutesElement.textContent = "00";
  secondsElement.textContent = "00";

  // Create list item
  let listItem = document.createElement("li");

  // Create span elements for task details
  let taskSpan = document.createElement("span");
  taskSpan.textContent = taskInput.value;

  let durationSpan = document.createElement("span");
  durationSpan.textContent = hours + ':' + minutes + ':' + seconds;

  let startTimeValue = document.createElement("span");
  startTimeValue.textContent = startTime.toLocaleTimeString();

  let endTimeValue = document.createElement("span");
  endTimeValue.textContent = endTime.toLocaleTimeString();

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "deleteButton";
  deleteButton.addEventListener("click", function () {
    // Remove the parent list item when the delete button is clicked
    listItem.remove();
  });

  // Append elements to the list item
  listItem.appendChild(taskSpan);
  listItem.appendChild(startTimeValue);
  listItem.appendChild(endTimeValue);
  listItem.appendChild(durationSpan);
  listItem.appendChild(deleteButton);

  tasklist.appendChild(listItem);

  // Set task input field to empty
  taskInput.value = "";
    // Reset the timer values
    hours = 0;
    minutes = 0;
    seconds = 0;
});

saveButton.addEventListener("click", function () {
  exportTasks();
  console.log('Save')
});

// Function to strip HTML tags from content
function stripHtmlTags(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

// Function to export tasks as CSV
function exportTasks() {
  // Get the task list items
  var taskListItems = tasklist.getElementsByTagName("li");
  console.log(taskListItems);
  // Prepare the CSV content with header and each task on a new line
  var csvContent = "Task,Start Time,End Time,Duration\n";

  for (var i = 0; i < taskListItems.length; i++) {
    var taskName = taskListItems[i]
      .querySelector("span:nth-child(1)")
      .textContent.trim();
    var startTime = taskListItems[i]
      .querySelector("span:nth-child(2)")
      .textContent.trim();
    var endTime = taskListItems[i]
      .querySelector("span:nth-child(3)")
      .textContent.trim();
    var duration = taskListItems[i]
      .querySelector("span:nth-child(4)")
      .textContent.trim();

    // Concatenate the task details in CSV format
    csvContent += `"${taskName}","${startTime}","${endTime}","${duration}"`;

    if (i < taskListItems.length - 1) {
      csvContent += "\n"; // Start a new line for the next <li> element
    }
  }

  // Create a Blob with the CSV content
  var blob = new Blob([csvContent], { type: "text/csv" });

  // Create an anchor element
  var a = document.createElement("a");

  // Set the href attribute with the object URL of the Blob
  a.href = window.URL.createObjectURL(blob);

  // Set the download attribute with the desired filename
  a.download = "task_list.csv";

  // Append the anchor element to the body
  document.body.appendChild(a);

  // Trigger a click event on the anchor element
  a.click();

  // Remove the anchor element from the body
  document.body.removeChild(a);
}

// Function to handle file upload
function handleFileUpload(event) {
  const fileInput = event.target;
  const fileList = fileInput.files;

  if (fileList.length > 0) {
    const uploadedFile = fileList[0];
    const reader = new FileReader();

    // Show a toast notification that the file is being read
    showToast("Reading file...");

    // Event listener for when the FileReader has finished reading the file
    reader.onload = function (e) {
      const csvContent = e.target.result;
      createListItemsFromCSV(csvContent);

      // Show a toast notification that the file has been successfully read
      showToast("File read successfully!");
    };

    // Read the content of the uploaded CSV file
    reader.readAsText(uploadedFile);
  }
}

// Function to create list items from CSV content
function createListItemsFromCSV(csvContent) {
  // Split the CSV content into rows
  const rows = csvContent.split("\n");

  // Remove the header row (if present)
  const header = rows[0].split(",");
  if (
    header.length === 4 &&
    header[0] === "Task" &&
    header[1] === "Start Time" &&
    header[2] === "End Time" &&
    header[3] === "Duration"
  ) {
    rows.shift();
  }

  // Iterate through the rows and create list items
  rows.forEach((row) => {
    const columns = row.split(",");
    const taskName = columns[0].replace(/"/g, ""); // Remove double quotes
    const startTime = columns[1].replace(/"/g, "");
    const endTime = columns[2].replace(/"/g, "");
    const duration = columns[3].replace(/"/g, "");

    // Create list item
    const listItem = document.createElement("li");

    // Create span elements for task details
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskName;

    const startTimeValue = document.createElement("span");
    startTimeValue.textContent = startTime;

    const endTimeValue = document.createElement("span");
    endTimeValue.textContent = endTime;

    const durationSpan = document.createElement("span");
    durationSpan.textContent = duration;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", function () {
      // Remove the parent list item when the delete button is clicked
      listItem.remove();
    });

    // Append elements to the list item
    listItem.appendChild(taskSpan);
    listItem.appendChild(startTimeValue);
    listItem.appendChild(endTimeValue);
    listItem.appendChild(durationSpan);
    listItem.appendChild(deleteButton);

    // Append the list item to the task list
    tasklist.appendChild(listItem);
  });
}

// Add an event listener to the file input
document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload);
