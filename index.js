window.onscroll = function() {myFunction()};

var header = document.getElementById("fixedHeader");
var sticky = header.offsetTop;

function myFunction() {
    if (window.scrollY > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

let socket = new WebSocket("ws://172.20.10.10:81/");
        socket.onmessage = function(event) {
          const data = event.data;

          // Handles different types of message types
          if (data.startsWith("HISTORY,")) {
            const parts = data.split(",");
            if (parts.length >= 4) {
              const counter = parts[1].trim();
              const time = parts[2].trim();
              const date = parts[3].trim();
              addHistoryEntry(counter, time, date);
            }
          } else if (data === "CLEAR_HISTORY") {
            document.getElementById("fishHistoryBody").innerHTML = "";
          } else {
            document.getElementById("sensorData").innerText = "Fish No.: " + event.data;
          }
            // When we get a new detection, request the updated history
            requestHistoryUpdate();
        };

// This function requests history from ESP32
function requestHistoryUpdate() {
  socket.send("REQUEST_HISTORY");
} 

// Function to add a new entry to the history table
function addHistoryEntry(counter, time, date) {
  const tableBody = document.getElementById("fishHistoryBody");
  const newRow = document.createElement("tr");

  const counterCell = document.createElement("td");
  counterCell.textContent = counter;

  const timeCell = document.createElement("td");
  timeCell.textContent = time;

  const dateCell = document.createElement("td");
  dateCell.textContent = date;


  newRow.appendChild(counterCell);
  newRow.appendChild(timeCell);
  newRow.appendChild(dateCell);

  // Insert at the beginning for newest entries at the top
  tableBody.insertBefore(newRow, tableBody.firstChild);
}

// Inital history request when page loads.
window.onload = function() {
  setTimeout(requestHistoryUpdate, 1000); // Slight delay to ensure connection is established
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
      document.getElementById('page-nav-toggle').checked = false;
  });
});