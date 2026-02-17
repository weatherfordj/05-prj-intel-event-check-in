const form = document.getElementById('checkInForm');
const nameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const celebrationDisplay = document.getElementById('celebrationMessage');
const attendeeListDisplay = document.getElementById("attendeeList");


// Track Attendee count
let attendeeCount = 0;
const maxAttendees = 50; // Set a maximum number of attendees
const attendeeCountDisplay = document.getElementById('attendeeCount');

let attendees = [];


function saveProgress() {
    const data = {
        total: attendeeCount,
        water: document.getElementById("waterCount").textContent,
        zero: document.getElementById("zeroCount").textContent,
        power: document.getElementById("powerCount").textContent
    };

    localStorage.setItem("summitAttendance", JSON.stringify(data));
}

function loadProgress() {
    const saved = localStorage.getItem("summitAttendance");

    if (!saved) return;

    const data = JSON.parse(saved);

    attendeeCount = parseInt(data.total) || 0;

    document.getElementById("attendeeCount").textContent = attendeeCount;
    document.getElementById("waterCount").textContent = data.water || 0;
    document.getElementById("zeroCount").textContent = data.zero || 0;
    document.getElementById("powerCount").textContent = data.power || 0;
}


// Initialize the attendance display
attendeeCountDisplay.textContent = attendeeCount;

function getWinningTeam() {
  const water = parseInt(document.getElementById("waterCount").textContent) || 0;
  const zero = parseInt(document.getElementById("zeroCount").textContent) || 0;
  const power = parseInt(document.getElementById("powerCount").textContent) || 0;

  const teams = [
    { name: "Team Water Wise", count: water },
    { name: "Team Net Zero", count: zero },
    { name: "Team Renewables", count: power }
  ];

  // Sort highest to lowest
  teams.sort((a, b) => b.count - a.count);

  // Tie check (top two same)
  if (teams[0].count === teams[1].count) {
    return "It's a tie!";
  }

  return teams[0].name;
}

function renderAttendeeList() {
  attendeeListDisplay.innerHTML = "";

  attendees.forEach((a) => {
    const row = document.createElement("div");
    row.classList.add("attendee-row");
    row.textContent = `${a.name} — ${a.teamName}`;
    attendeeListDisplay.appendChild(row);
  });
}


//Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    //Get form values
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    console.log(name, teamName);
    attendees.push({ name: name.trim(), teamName });
    renderAttendeeList();


    //Increment attendee count
    attendeeCount++
    console.log("Total Attendees: ", attendeeCount);
    attendeeCountDisplay.textContent = attendeeCount;

    // Check if attendance goal reached
    if (attendeeCount === maxAttendees) {
    const winningTeam = getWinningTeam();
    celebrationDisplay.textContent = `🎉 Attendance goal reached! ${winningTeam} wins the summit!`;
    }


    //update progress bar
    const percentage = Math.round((attendeeCount / maxAttendees) * 100) + "%";
    console.log(`Progress: ${percentage}`);

    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage;

    //Update team count
    const teamCounter = document.getElementById(team + "Count");
    teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
    
    //Show welcome message
    const message = `🎊 Welcome, ${name}! You are part of ${teamName}.`;
    console.log(message);

    saveProgress();

    //Reset form
    form.reset();

    
});

loadProgress();