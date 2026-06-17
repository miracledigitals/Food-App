const ProfileModule = {
  init() {
    // 1. Settings Form (Profile & Targets)
    const settingsForm = document.getElementById("profile-settings-form");
    if (settingsForm) {
      settingsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById("profile-input-name").value.trim();
        const role = document.getElementById("profile-input-role").value.trim();
        const calories = document.getElementById("profile-input-calories").value;
        const protein = document.getElementById("profile-input-protein").value;
        const carbs = document.getElementById("profile-input-carbs").value;
        const fats = document.getElementById("profile-input-fats").value;

        try {
          if (SupabaseService.isLoggedIn()) {
            // Save to Supabase Profiles table
            await SupabaseService.updateProfile({
              fullName, role, calorieTarget: calories, proteinTarget: protein, carbsTarget: carbs, fatsTarget: fats
            });
          }
          
          // Always sync changes locally to maintain local config
          State.updateSettings({
            calories, protein, carbs, fats
          });
          
          // Update user name indicators in sidebar/header
          this.syncNameLabels(fullName, role);

          alert("Profile settings and macro targets updated successfully!");
          
          // Reload dashboard/stats
          this.render();
        } catch (err) {
          alert("Failed to save profile: " + err.message);
        }
      });
    }

    // 2. Avatar Selections
    const avatarItems = document.querySelectorAll(".profile-avatar-option");
    avatarItems.forEach(item => {
      item.addEventListener("click", () => {
        avatarItems.forEach(a => a.classList.remove("selected"));
        item.classList.add("selected");
        const initials = item.innerText;
        document.getElementById("user-profile-btn").innerText = initials;
        try {
          localStorage.setItem("user_avatar_initials", initials);
        } catch (e) {
          console.warn("localStorage write failed:", e);
        }
      });
    });

    // Populate initial avatar
    let savedInitials = "U";
    try {
      savedInitials = localStorage.getItem("user_avatar_initials") || "U";
    } catch (e) {
      console.warn("localStorage read failed:", e);
    }
    const userProfileBtn = document.getElementById("user-profile-btn");
    if (userProfileBtn) userProfileBtn.innerText = savedInitials;
    avatarItems.forEach(item => {
      if (item.innerText === savedInitials) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });

    // 3. Auth Buttons
    const logoutBtn = document.getElementById("profile-btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to sign out?")) {
          try {
            await SupabaseService.signOut();
            alert("Signed out successfully!");
            this.updateStatus();
          } catch (e) {
            alert("Error signing out: " + e.message);
          }
        }
      });
    }

    // Setup listeners for updates
    window.addEventListener("supabaseAuthChanged", () => {
      this.updateStatus();
      this.render();
    });

    // Initial render
    this.updateStatus();
    this.render();
  },

  syncNameLabels(name, role) {
    // Top sidebar / avatar labels
    const sidebarName = document.querySelector(".sidebar .user-name");
    const sidebarRole = document.querySelector(".sidebar .user-role");
    
    const displayName = name || "User";
    const displayRole = role || "Nutrition Enthusiast";
    
    if (sidebarName) sidebarName.innerText = displayName;
    if (sidebarRole) sidebarRole.innerText = displayRole;

    const dashGreeting = document.getElementById("dashboard-greeting");
    if (dashGreeting) {
      // Pick first name
      const firstName = displayName.split(" ")[0];
      dashGreeting.innerText = `Good morning, ${firstName}!`;
    }

    // Dynamically update avatar initials if it's set to default AM or U
    const userProfileBtn = document.getElementById("user-profile-btn");
    if (userProfileBtn) {
      let savedInitials = null;
      try {
        savedInitials = localStorage.getItem("user_avatar_initials");
      } catch (e) {
        console.warn("localStorage read failed:", e);
      }
      if (!savedInitials || savedInitials === "AM" || savedInitials === "U") {
        let initials = "U";
        if (name) {
          const parts = name.trim().split(/\s+/);
          if (parts.length > 1) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          } else if (parts.length === 1 && parts[0]) {
            initials = parts[0][0].toUpperCase();
          }
        }
        userProfileBtn.innerText = initials;
      }
    }
  },

  async updateStatus() {
    const connLight = document.getElementById("db-conn-light");
    const connText = document.getElementById("db-conn-text");
    const authStatusBox = document.getElementById("profile-auth-status-box");

    if (!connLight || !connText || !authStatusBox) return;

    // Clear classes
    connLight.className = "indicator-dot";

    if (!Config.isConfigured() || !SupabaseService.client) {
      connLight.style.backgroundColor = "#dc3545"; // Red
      connText.innerText = "Offline (Supabase connection error)";
      authStatusBox.innerHTML = `
        <div style="font-size: 13px; color: #dc3545; margin-bottom: 8px;">Failed to connect to Supabase. Checking network or config.</div>
      `;
      this.populateLocalSettings();
      return;
    }

    // Success configuration
    connLight.style.backgroundColor = "#2d6a4f"; // Green
    connText.innerText = "Connected to Supabase Cloud";

    if (SupabaseService.isLoggedIn()) {
      authStatusBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div>
            <div style="font-weight: 700; font-size: 14px;">Signed In</div>
            <div style="font-size: 12px; color: var(--text-muted);">${SupabaseService.currentUser.email}</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="profile-btn-logout-direct"><i class="fa-solid fa-sign-out-alt"></i> Sign Out</button>
        </div>
      `;
      
      const directLogoutBtn = document.getElementById("profile-btn-logout-direct");
      if (directLogoutBtn) {
        directLogoutBtn.addEventListener("click", () => {
          const mainLogoutBtn = document.getElementById("profile-btn-logout");
          if (mainLogoutBtn) mainLogoutBtn.click();
        });
      }

      // Fetch profile variables to auto-fill
      const profile = await SupabaseService.getProfile();
      if (profile) {
        document.getElementById("profile-input-name").value = profile.full_name || "";
        document.getElementById("profile-input-role").value = profile.role || "";
        document.getElementById("profile-input-calories").value = profile.calorie_target || 2000;
        document.getElementById("profile-input-protein").value = profile.protein_target || 130;
        document.getElementById("profile-input-carbs").value = profile.carbs_target || 220;
        document.getElementById("profile-input-fats").value = profile.fats_target || 65;
        this.syncNameLabels(profile.full_name || "", profile.role || "");
      }
    } else {
      authStatusBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div>
            <div style="font-weight: 700; font-size: 14px;">Not Authenticated</div>
            <div style="font-size: 11px; color: var(--text-muted);">Please log in to sync database.</div>
          </div>
        </div>
      `;
      this.populateLocalSettings();
    }
  },

  populateLocalSettings() {
    const settings = State.data.settings;
    document.getElementById("profile-input-name").value = "";
    document.getElementById("profile-input-role").value = "";
    document.getElementById("profile-input-calories").value = settings.calories;
    document.getElementById("profile-input-protein").value = settings.protein;
    document.getElementById("profile-input-carbs").value = settings.carbs;
    document.getElementById("profile-input-fats").value = settings.fats;
    this.syncNameLabels("", "");
  },

  render() {
    // Calculate dashboard statistics
    const loggedMeals = State.data.loggedMeals;

    // Total Entries
    document.getElementById("stat-total-entries").innerText = loggedMeals.length;

    // Calculate Consistency Score
    // Percentage of logged days where user met calorie target (+/- 15%)
    let consistentDaysCount = 0;
    const dailyCalMap = {};

    loggedMeals.forEach(log => {
      const dateKey = log.timestamp.split("T")[0];
      if (!dailyCalMap[dateKey]) dailyCalMap[dateKey] = 0;
      dailyCalMap[dateKey] += log.calories;
    });

    const targetCal = State.data.settings.calories;
    const dates = Object.keys(dailyCalMap);
    
    dates.forEach(date => {
      const cals = dailyCalMap[date];
      if (cals >= targetCal * 0.85 && cals <= targetCal * 1.15) {
        consistentDaysCount++;
      }
    });

    const consistencyPercent = dates.length > 0 ? Math.round((consistentDaysCount / dates.length) * 100) : 0;
    document.getElementById("stat-consistency-score").innerText = `${consistencyPercent}%`;

    // Calculate logging streak (consecutive active days)
    let currentStreak = 0;
    if (dates.length > 0) {
      // Sort dates descending
      const sortedDates = dates.map(d => new Date(d).getTime()).sort((a,b) => b-a);
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      let checkTime = new Date().setHours(0,0,0,0);
      let index = 0;

      // Allow today or yesterday as starting point for active streak
      if (sortedDates.includes(checkTime) || sortedDates.includes(checkTime - oneDayMs)) {
        if (sortedDates.includes(checkTime)) {
          currentStreak++;
          checkTime -= oneDayMs;
        } else {
          // Streak active from yesterday
          checkTime -= oneDayMs;
        }

        while (sortedDates.includes(checkTime)) {
          currentStreak++;
          checkTime -= oneDayMs;
        }
      }
    }
    document.getElementById("stat-active-streak").innerText = `${currentStreak} Days`;
  }
};

// Bind to window load
document.addEventListener("DOMContentLoaded", () => {
  ProfileModule.init();
  window.ProfileModule = ProfileModule;
});
