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

  // Edit Targets Modal
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

  targetsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    State.updateSettings({
      calories: calorieInput.value,
      protein: proteinInput.value,
      carbs: carbsInput.value,
      fats: fatsInput.value
    });
    closeModal("modal-edit-targets");
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
    }
  }

  // Set default logger datetime
  const logTimeField = document.getElementById("log-meal-time");
  if (logTimeField) {
    const now = new Date();
    // Offset local date for datetime-local input string format
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
