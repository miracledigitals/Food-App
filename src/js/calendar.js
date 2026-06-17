const CalendarModule = {
  currentMonth: 5, // June (0-indexed: 0=Jan, 5=Jun)
  currentYear: 2026,

  init() {
    // Prev / Next Month clicks (Just mock for demo by changing title, but keep grid rendering)
    document.getElementById("btn-prev-month").addEventListener("click", () => {
      alert("Previous month viewing is disabled in this prototype.");
    });
    
    document.getElementById("btn-next-month").addEventListener("click", () => {
      alert("Next month viewing is disabled in this prototype.");
    });

    // Add reminder click handler
    const addReminderBtn = document.getElementById("btn-add-reminder");
    addReminderBtn.addEventListener("click", () => {
      const text = prompt("Enter a new meal prep reminder or grocery task:");
      if (text && text.trim() !== "") {
        State.addReminder(text.trim());
        this.render();
      }
    });
  },

  render() {
    // Set Header Title
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("calendar-month-year").innerText = `${monthNames[this.currentMonth]} ${this.currentYear}`;

    // 1. Render Calendar Days Grid
    const daysContainer = document.getElementById("calendar-days-container");
    daysContainer.innerHTML = "";

    // Render weekday headers
    const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdayNames.forEach(name => {
      const header = document.createElement("div");
      header.className = "calendar-day-name";
      header.innerText = name;
      daysContainer.appendChild(header);
    });

    // June 2026 starts on Monday (1st) and has 30 days
    const totalDays = 30;
    
    // We want to fill 35 cells to make a neat grid
    const cellsToRender = 35; 

    // Render cells
    for (let i = 1; i <= cellsToRender; i++) {
      const cell = document.createElement("div");
      
      if (i <= totalDays) {
        // Active month days (June 1 - 30)
        cell.className = "calendar-day-cell";
        
        // Today check (Today is June 17, 2026)
        if (i === 17) {
          cell.classList.add("today");
        }

        cell.innerHTML = `
          <div class="calendar-day-number">${i}</div>
          <div class="calendar-day-indicators" id="indicators-day-${i}"></div>
        `;

        // Calculate and add indicator dots
        this.addIndicatorsForDay(i, cell);

      } else {
        // Next month days (July 1 - 5)
        const nextMonthDay = i - totalDays;
        cell.className = "calendar-day-cell other-month";
        cell.innerHTML = `
          <div class="calendar-day-number">${nextMonthDay}</div>
          <div class="calendar-day-indicators"></div>
        `;
      }

      daysContainer.appendChild(cell);
    }

    // 2. Render Target Tracker Metrics in Sidebar
    this.renderTargetsSidebar();

    // 3. Render Reminders Checklist
    this.renderReminders();
  },

  addIndicatorsForDay(dayNumber, cellElement) {
    const indicatorsContainer = cellElement.querySelector(".calendar-day-indicators");
    if (!indicatorsContainer) return;

    // Check if there are planned meals in that weekday.
    // June 2026 week mapping:
    // June 15-21 corresponds to Monday-Sunday of our active week plan.
    // Let's check which day of the week this dayNumber corresponds to:
    // Days 1-7: Monday-Sunday
    // Days 8-14: Monday-Sunday
    // Days 15-21: Monday-Sunday (Our Planner Week)
    // Days 22-28: Monday-Sunday
    // Days 29-30: Monday-Tuesday
    const dayOfWeekIndex = (dayNumber - 1) % 7;
    const weekdayNamesEnglish = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayName = weekdayNamesEnglish[dayOfWeekIndex];

    const planner = State.data.weeklyPlanner[dayName] || {};
    const hasPlannedMeals = planner.breakfast || planner.lunch || planner.dinner || planner.snack;

    // Check if there are logged meals for this date.
    // Date format for matching: "2026-06-XX"
    const dateString = `2026-06-${dayNumber.toString().padStart(2, "0")}`;
    const hasLoggedMeals = State.data.loggedMeals.some(log => log.timestamp.startsWith(dateString));

    // Render blue dot for planned
    if (hasPlannedMeals) {
      const plannedDot = document.createElement("span");
      plannedDot.className = "indicator-dot planned";
      plannedDot.title = "Meals Planned";
      indicatorsContainer.appendChild(plannedDot);
    }

    // Render green dot for logged
    if (hasLoggedMeals) {
      const loggedDot = document.createElement("span");
      loggedDot.className = "indicator-dot logged";
      loggedDot.title = "Meals Logged";
      indicatorsContainer.appendChild(loggedDot);
    }
  },

  renderTargetsSidebar() {
    // Let's count how many days of the month have logs
    const loggedDays = new Set();
    State.data.loggedMeals.forEach(log => {
      const datePart = log.timestamp.split("T")[0]; // YYYY-MM-DD
      if (datePart.startsWith("2026-06")) {
        loggedDays.add(datePart);
      }
    });

    const loggedCount = loggedDays.size;
    // Planned days in our active plan week (Mon-Sun June 15-21)
    let plannedCount = 0;
    const weekdayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    weekdayNames.forEach(day => {
      const plan = State.data.weeklyPlanner[day] || {};
      if (plan.breakfast || plan.lunch || plan.dinner || plan.snack) {
        plannedCount++;
      }
    });

    // Mock other weeks as planned too, to look realistic for a monthly grid
    const totalPlannedDays = plannedCount + 9; // 15 total

    document.getElementById("month-logged-count").innerText = loggedCount;
    document.getElementById("month-planned-count").innerText = totalPlannedDays;

    // Update progress bars
    const calPercentage = Math.min(100, Math.round((loggedCount / 15) * 100));
    document.getElementById("month-cal-percentage").innerText = `${calPercentage}%`;
    document.getElementById("month-cal-progress-bar").style.width = `${calPercentage}%`;

    const protPercentage = Math.min(100, Math.round((loggedCount / 18) * 100));
    document.getElementById("month-prot-percentage").innerText = `${protPercentage}%`;
    document.getElementById("month-prot-progress-bar").style.width = `${protPercentage}%`;
  },

  renderReminders() {
    const list = document.getElementById("calendar-reminders-list");
    list.innerHTML = "";

    const reminders = State.data.reminders;
    if (reminders.length === 0) {
      list.innerHTML = `<li style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px 0;">No reminders logged</li>`;
      return;
    }

    reminders.forEach(reminder => {
      const li = document.createElement("li");
      li.className = "reminder-item";
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "reminder-checkbox";
      checkbox.checked = reminder.completed;
      checkbox.addEventListener("change", () => {
        State.toggleReminder(reminder.id);
        this.render();
      });

      const span = document.createElement("span");
      span.className = "reminder-text";
      span.innerText = reminder.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-icon btn-sm";
      deleteBtn.style.border = "none";
      deleteBtn.style.background = "none";
      deleteBtn.style.marginLeft = "auto";
      deleteBtn.style.color = "#dc3545";
      deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
      deleteBtn.addEventListener("click", () => {
        if (confirm("Delete this reminder?")) {
          State.deleteReminder(reminder.id);
          this.render();
        }
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }
};

// Bind to window load
document.addEventListener("DOMContentLoaded", () => {
  CalendarModule.init();
  window.CalendarModule = CalendarModule;
});
