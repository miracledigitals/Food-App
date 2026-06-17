// Global Modal Helper functions
window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
  }
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("active");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Navigation Routing
  const navItems = document.querySelectorAll(".nav-menu .nav-item");
  const viewSections = document.querySelectorAll(".view-section");

  function switchView(viewName) {
    // Deactivate all nav menu items and sections
    navItems.forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Run custom section load hooks if any
    triggerSectionReload(viewName);
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const viewName = item.getAttribute("data-view");
      switchView(viewName);
    });
  });

  // Sidebar profile footer click triggers profile page transition
  const sidebarFooterUser = document.getElementById("sidebar-user-footer");
  if (sidebarFooterUser) {
    sidebarFooterUser.addEventListener("click", () => {
      switchView("profile");
    });
  }

  // Dark/Light Theme Switcher
  const themeToggle = document.getElementById("dark-theme-toggle");
  const savedTheme = localStorage.getItem("sous_chef_theme") || "light";

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.checked = true;
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.checked = false;
  }

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("sous_chef_theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("sous_chef_theme", "light");
    }
  });

  // Edit Targets Modal (Dashboard Quick Action)
  const editTargetsBtn = document.getElementById("btn-edit-targets");
  const targetsForm = document.getElementById("targets-form");
  const calorieInput = document.getElementById("target-input-calories");
  const proteinInput = document.getElementById("target-input-protein");
  const carbsInput = document.getElementById("target-input-carbs");
  const fatsInput = document.getElementById("target-input-fats");

  editTargetsBtn.addEventListener("click", () => {
    // Populate form with current state settings
    const settings = State.data.settings;
    calorieInput.value = settings.calories;
    proteinInput.value = settings.protein;
    carbsInput.value = settings.carbs;
    fatsInput.value = settings.fats;
    openModal("modal-edit-targets");
  });

  targetsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const calories = calorieInput.value;
    const protein = proteinInput.value;
    const carbs = carbsInput.value;
    const fats = fatsInput.value;

    try {
      if (window.SupabaseService && SupabaseService.isLoggedIn()) {
        const profile = await SupabaseService.getProfile();
        await SupabaseService.updateProfile({
          fullName: profile ? profile.full_name : "Alex Miller",
          role: profile ? profile.role : "Nutrition Pro",
          calorieTarget: calories,
          proteinTarget: protein,
          carbsTarget: carbs,
          fatsTarget: fats
        });
      }
      State.updateSettings({ calories, protein, carbs, fats });
      closeModal("modal-edit-targets");
    } catch (err) {
      alert("Failed saving targets to cloud: " + err.message);
    }
  });

  // Authentication Modal Handler (Login / Sign Up toggles)
  let isSignUpMode = false;
  const authForm = document.getElementById("auth-form");
  const authModalTitle = document.getElementById("auth-modal-title");
  const authNameGroup = document.getElementById("auth-group-name");
  const authSubmitBtn = document.getElementById("btn-auth-submit");
  const authToggleLink = document.getElementById("btn-toggle-auth-mode");

  authToggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
      authModalTitle.innerText = "Create Cloud Account";
      authNameGroup.style.display = "flex";
      authSubmitBtn.innerText = "Register";
      authToggleLink.innerText = "Already have an account? Sign In";
      document.getElementById("auth-input-name").required = true;
    } else {
      authModalTitle.innerText = "Sign In to Cloud Sync";
      authNameGroup.style.display = "none";
      authSubmitBtn.innerText = "Sign In";
      authToggleLink.innerText = "Don't have an account? Sign Up";
      document.getElementById("auth-input-name").required = false;
    }
  });

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("auth-input-email").value.trim();
    const password = document.getElementById("auth-input-password").value;
    const name = document.getElementById("auth-input-name").value.trim();

    authSubmitBtn.disabled = true;
    authSubmitBtn.innerText = isSignUpMode ? "Registering..." : "Signing in...";

    try {
      if (isSignUpMode) {
        await SupabaseService.signUp(email, password, name);
        alert("Registration successful! Check email if validation is required or configure login.");
      } else {
        await SupabaseService.signIn(email, password);
        alert("Welcome back! Loading cloud synced data...");
      }
      closeModal("modal-auth");
      authForm.reset();
    } catch (error) {
      alert("Auth Error: " + error.message);
    } finally {
      authSubmitBtn.disabled = false;
      authSubmitBtn.innerText = isSignUpMode ? "Register" : "Sign In";
    }
  });

  // Navigation Shortcut Links
  document.getElementById("btn-dashboard-quick-log").addEventListener("click", () => {
    switchView("logger");
  });

  document.getElementById("btn-go-to-grocery").addEventListener("click", () => {
    switchView("grocery");
  });

  // Section reload triggers
  function triggerSectionReload(viewName) {
    switch (viewName) {
      case "dashboard":
        if (window.DashboardModule && typeof window.DashboardModule.render === "function") {
          window.DashboardModule.render();
        }
        break;
      case "calendar":
        if (window.CalendarModule && typeof window.CalendarModule.render === "function") {
          window.CalendarModule.render();
        }
        break;
      case "logger":
        if (window.LoggerModule && typeof window.LoggerModule.initForm === "function") {
          window.LoggerModule.initForm();
        }
        break;
      case "recipes":
        if (window.RecipesModule && typeof window.RecipesModule.render === "function") {
          window.RecipesModule.render();
        }
        break;
      case "grocery":
        if (window.GroceryModule && typeof window.GroceryModule.render === "function") {
          window.GroceryModule.render();
        }
        break;
      case "profile":
        if (window.ProfileModule && typeof window.ProfileModule.render === "function") {
          window.ProfileModule.render();
          window.ProfileModule.updateStatus();
        }
        break;
    }
  }

  // Set default logger datetime
  const logTimeField = document.getElementById("log-meal-time");
  if (logTimeField) {
    const now = new Date();
    const offsetNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    logTimeField.value = offsetNow;
  }

  // Global update listener
  window.addEventListener("stateUpdated", () => {
    // Re-render whichever view is currently active
    const activeItem = document.querySelector(".nav-menu .nav-item.active");
    if (activeItem) {
      triggerSectionReload(activeItem.getAttribute("data-view"));
    }
  });

  // Run initial render for dashboard
  switchView("dashboard");
});
