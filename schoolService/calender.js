import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
s

async function createMeeting(id) {
    console.log("Create opportunity called!");
  
    // Inputs
    const meetingDate = document.getElementById("meeting-date").value;   // YYYY-MM-DD
    const meetingTime = document.getElementById("meeting-time").value;   // HH:MM
    const meetingDesc = document.getElementById("meeting-desc").value;
    const meetingLocation = document.getElementById("meeting-location").value;
    const isAnEvent = document.querySelector('input[name="event"]:checked')?.value === "yes";
    const isLeadersOnly = document.getElementById("leaders-only")?.checked === true;
    const isGod = localStorage.getItem("isGod") === "true";
    const isLeader = localStorage.getItem("isLeader") === "true";
    const recurring = document.getElementById("recurring")?.checked === true;
  
    if (!meetingDate || !meetingTime || !meetingDesc || !meetingLocation) {
      alert("Please fill in all fields!");
      return;
    }
  
    // Helpers (scoped here to avoid changing imports/Globals)
    const atLocalTime = (dateOnly, timeHHmm) => {
      const [y, m, d] = dateOnly.split("-").map(Number);
      const [hh, mm] = timeHHmm.split(":").map(Number);
      return new Date(y, m - 1, d, hh, mm, 0, 0);
    };
    const addDays = (dt, n) => {
      const d = new Date(dt.getTime());
      d.setDate(d.getDate() + n);
      return d;
    };
    const addMonthsPreserveDate = (dt, n) => {
      const d = new Date(dt.getTime());
      d.setMonth(d.getMonth() + n);
      return d;
    };
  
    const firstDateTime = atLocalTime(meetingDate, meetingTime);
  
    const overlappingMeetingsCount = await getNearbyMeetingsCount(firstDateTime, id);
    if (overlappingMeetingsCount >= 3) {
      const formattedDate = firstDateTime.toLocaleDateString();
      const formattedTime = firstDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const proceed = confirm(`There are currently ${overlappingMeetingsCount} meetings by other clubs within ±2 hours of ${formattedTime} on ${formattedDate}. Do you still want to add this meeting?`);
      if (!proceed) {
        console.log("Meeting creation canceled due to nearby meeting density.");
        return;
      }
    }
  
    // Build list of occurrence Date objects (always include the first)
    let occurrences = [firstDateTime];
  
    if (recurring) {
      const freq = document.getElementById("frequency").value; // "weekly"|"biweekly"|"monthly"
      const endType = document.querySelector('input[name="end-type"]:checked')?.value || "count";
  
      if (endType === "count") {
        // Number of repetitions (including the first one already added)
        let reps = parseInt(document.getElementById("repetitions").value || "1", 10);
        if (isNaN(reps) || reps < 1) reps = 1;
  
        if (freq === "weekly" || freq === "biweekly") {
          const step = (freq === "biweekly") ? 14 : 7;
          let cur = new Date(firstDateTime.getTime());
          for (let i = 1; i < reps; i++) {
            cur = addDays(cur, step);
            occurrences.push(new Date(cur.getTime()));
          }
        } else { // monthly
          let cur = new Date(firstDateTime.getTime());
          for (let i = 1; i < reps; i++) {
            cur = addMonthsPreserveDate(cur, 1);
            occurrences.push(new Date(cur.getTime()));
          }
        }
      } else {
        // End by date (inclusive)
        const untilRaw = document.getElementById("end-date").value;
        if (!untilRaw) {
          alert("Please choose an end date for the recurrence.");
          return;
        }
        const [uy, um, ud] = untilRaw.split("-").map(Number);
        const until = new Date(uy, um - 1, ud, 23, 59, 59, 999);
  
        if (freq === "weekly" || freq === "biweekly") {
          const step = (freq === "biweekly") ? 14 : 7;
          let cur = addDays(firstDateTime, step);
          while (cur <= until) {
            occurrences.push(new Date(cur.getTime()));
            cur = addDays(cur, step);
          }
        } else { // monthly
          let cur = addMonthsPreserveDate(firstDateTime, 1);
          while (cur <= until) {
            occurrences.push(new Date(cur.getTime()));
            cur = addMonthsPreserveDate(cur, 1);
          }
        }
      }
    }
  
    // Write each occurrence as an unrelated meeting doc (no new fields added)
    const clubDocRef = doc(db, "clubs", id);
    const meetingsCollectionRef = collection(clubDocRef, "all-meetings");
  
    for (const when of occurrences) {
      const meetingTimestamp = Timestamp.fromDate(when);
      const newMeetingRef = doc(meetingsCollectionRef); // Auto ID
      await setDoc(newMeetingRef, {
        attendance: 0,
        description: meetingDesc,
        location: meetingLocation,
        date: meetingTimestamp,
        isAnEvent: isAnEvent,
        privateMeeting: !!isLeadersOnly
      });
    }
  
    console.log(`Saved ${occurrences.length} meeting(s).`);
    location.reload();
  }
  function renderCalendar(date) {
    const viewIsMonth = viewMode === "month";
    const year = date.getFullYear();
    const month = date.getMonth();

    daysContainer.innerHTML = '';
    daysContainer.classList.toggle('days--week', !viewIsMonth);

    if (viewIsMonth) {
        renderMonthView({ year, month });
    } else {
        renderWeekView(date);
    }
}

function renderMonthView({ year, month }) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    monthYear.innerText = `${months[month]} ${year}`;

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay; i > 0; i--) {
        const prevMonthDate = prevMonthLastDay - i + 1;
        const dayDiv = createDayCell({
            label: prevMonthDate,
            date: new Date(year, month - 1, prevMonthDate),
            fade: true
        });
        daysContainer.appendChild(dayDiv);
    }

    for (let day = 1; day <= lastDay; day++) {
        const dateObj = new Date(year, month, day);
        const isToday = dateObj.getTime() === today.getTime();
        const dayDiv = createDayCell({
            label: day,
            date: dateObj,
            highlightToday: isToday
        });
        daysContainer.appendChild(dayDiv);
    }

    const nextMonthStartDay = 7 - new Date(year, month + 1, 1).getDay();
    for (let i = 1; i <= nextMonthStartDay; i++) {
        const dayDiv = createDayCell({
            label: i,
            date: new Date(year, month + 1, i),
            fade: true
        });
        daysContainer.appendChild(dayDiv);
    }

    weekdaysContainer.classList.remove('weekdays--hidden');
    weekdaysContainer.setAttribute('aria-hidden', 'false');
}

function renderWeekView(referenceDate) {
    const weekStart = new Date(referenceDate);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(referenceDate.getDate() - referenceDate.getDay());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(0, 0, 0, 0);

    monthYear.innerText = formatWeekHeader(weekStart, weekEnd);

    weekdaysContainer.classList.add('weekdays--hidden');
    weekdaysContainer.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + i);
        currentDay.setHours(0, 0, 0, 0);
        const isToday = currentDay.getTime() === today.getTime();

        const dayDiv = createDayCell({
            label: currentDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            date: currentDay,
            highlightToday: isToday,
            enforceWidth: true,
            weekdayLabel: currentDay.toLocaleDateString(undefined, { weekday: 'short' })
        });
        daysContainer.appendChild(dayDiv);
    }
}

function createDayCell({ label, date, fade = false, highlightToday = false, enforceWidth = false, weekdayLabel = '' }) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('actualday');
    if (fade) dayDiv.classList.add('fade');
    if (highlightToday) dayDiv.classList.add('today');
    if (enforceWidth) dayDiv.classList.add('actualday--week');

    const numberSpan = document.createElement('span');
    numberSpan.className = 'day-number';
    numberSpan.textContent = label;

    if (weekdayLabel) {
        const weekdaySpan = document.createElement('span');
        weekdaySpan.className = 'day-weekday';
        weekdaySpan.textContent = weekdayLabel;
        dayDiv.appendChild(weekdaySpan);
    }

    const eventsWrap = document.createElement('div');
    eventsWrap.className = 'day-events';

    dayDiv.appendChild(numberSpan);
    dayDiv.appendChild(eventsWrap);

    attachEventsToDay({ container: dayDiv, date });

    return dayDiv;
}

function attachEventsToDay({ container, date }) {
    const filteredEvents = events.filter((event) => {
        // Access control for leaders-only (privateMeeting)
        const isGod = localStorage.getItem("isGod") === "true";        // admin
        const isLeader = localStorage.getItem("isLeader") === "true";  // logged-in user is a leader (for some club)
        const currentUsername = localStorage.getItem("username") || localStorage.getItem("club") || null;
        const isClubLeaderForThisClub = isLeader && currentUsername === event.username;

        // If the meeting is private, only show it to admins or the club's leader
        if (event.privateMeeting && (!isGod && !isClubLeaderForThisClub)) {
            return;
        }
        else {
            const eventDate = new Date(event.dateObj);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === date.getTime();
        }
    });

    filteredEvents.forEach((event) => {
        const eventDiv = document.createElement('div');

        // decide whether to show a detailed label (time | title | location)
        const isMobile = window.matchMedia('(max-width: 700px)').matches;
        const showDetailed = (viewMode === 'week') || isMobile;

        // ensure we have a clean time string (fallback to dateObj if needed)
        const timeStr = event.time || (new Date(event.dateObj)).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

        if (showDetailed || isMobile) {
            const compactLabel = `${timeStr} | ${event.title} ${event.type || 'Meeting'} | ${event.location || 'TBA'}`;
            eventDiv.setAttribute('title', compactLabel); // hover/tap fallback

            const timeLine = document.createElement('div');
            timeLine.className = 'event-line event-line--time';
            timeLine.textContent = timeStr;

            const titleLine = document.createElement('div');
            titleLine.className = 'event-line event-line--title';
            titleLine.textContent = `${event.title} ${event.type || 'Meeting'}`;

            const locationLine = document.createElement('div');
            locationLine.className = 'event-line event-line--location';
            locationLine.textContent = event.location || 'TBA';

            // Append lines in order (each will render on its own line)
            eventDiv.appendChild(timeLine);
            eventDiv.appendChild(titleLine);
            eventDiv.appendChild(locationLine);
        } 
        else {
            const label = `${event.title} ${event.type}`;
            eventDiv.textContent = label;
            eventDiv.setAttribute('title', label);
        }

        // style special event types
        if (event.type === 'Event') {
            eventDiv.classList.add('event-highlight-meeting'); // visual for public events
        }
        if (event.privateMeeting) {
            eventDiv.classList.add('leader-highlight-meeting'); // visual for leader-only meetings
        }

        eventDiv.classList.add('event');
    
        eventDiv.addEventListener('click', function () {
            sessionStorage.setItem("club", event.username);

            const infoModal = document.getElementById("eventInfoModal");

            document.getElementById("clubPopUp").innerHTML = "Club: ";
            document.getElementById("datePopUp").innerHTML = "Date: ";
            document.getElementById("timePopUp").innerHTML = "Time: ";
            document.getElementById("locationPopUp").innerHTML = "Location: ";
            document.getElementById("descriptionPopUp").innerHTML = "Description: ";

            document.getElementById("clubPopUp").innerHTML += event.title;
            document.getElementById("datePopUp").innerHTML += event.date;
            document.getElementById("timePopUp").innerHTML += event.time;
            document.getElementById("locationPopUp").innerHTML += event.location;
            document.getElementById("descriptionPopUp").innerHTML += event.description;

            infoModal.style.display = "flex";
        });

        const eventsWrapper = container.querySelector('.day-events') || container;
        eventsWrapper.appendChild(eventDiv);
    });
}

function formatWeekHeader(startDate, endDate) {
    const startMonthName = months[startDate.getMonth()];
    const endMonthName = months[endDate.getMonth()];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    if (startYear === endYear) {
        if (startMonthName === endMonthName) {
            return `${startMonthName} ${startDate.getDate()} - ${endDate.getDate()}, ${startYear}`;
        }
        return `${startMonthName} ${startDate.getDate()} - ${endMonthName} ${endDate.getDate()}, ${startYear}`;
    }

    return `${startMonthName} ${startDate.getDate()}, ${startYear} - ${endMonthName} ${endDate.getDate()}, ${endYear}`;
}

// Navigate to the previous month.
prevButton.addEventListener('click', function () {
    if (viewMode === "month") {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
        currentDate.setDate(currentDate.getDate() - 7);
    }
    renderCalendar(currentDate);
});

// Navigate to the next month.
nextButton.addEventListener('click', function () {
    if (viewMode === "month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
        currentDate.setDate(currentDate.getDate() + 7);
    }
    renderCalendar(currentDate);
});


console.log("ran the code");
// Initial render of the calendar.
