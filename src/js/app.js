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
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  function closeMobileMenu() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

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

    // Close slide drawer on view transition
    closeMobileMenu();

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

  // Mobile Hamburger & Backdrop toggle triggers
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (sidebar) sidebar.classList.add("open");
      if (overlay) overlay.classList.add("open");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      closeMobileMenu();
    });
  }

  // Dark/Light Theme Switcher
  const themeToggle = document.getElementById("dark-theme-toggle");
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("sous_chef_theme") || "light";
  } catch (e) {
    console.warn("localStorage read failed:", e);
  }

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
      try {
        localStorage.setItem("sous_chef_theme", "dark");
      } catch (e) {
        console.warn("localStorage write failed:", e);
      }
    } else {
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.setItem("sous_chef_theme", "light");
      } catch (e) {
        console.warn("localStorage write failed:", e);
      }
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
          fullName: profile?.full_name || "",
          role: profile?.role || "Nutrition Enthusiast",
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

  // Dedicated Login / Sign Up Page Handler
  let isPageSignUpMode = false;
  const pageAuthForm = document.getElementById("page-auth-form");
  const pageAuthTitle = document.getElementById("page-auth-title");
  const pageAuthSubtitle = document.getElementById("page-auth-subtitle");
  const pageAuthNameGroup = document.getElementById("page-auth-group-name");
  const pageAuthSubmitBtn = document.getElementById("btn-page-auth-submit");
  const pageAuthToggleLink = document.getElementById("btn-page-toggle-auth");

  if (pageAuthToggleLink) {
    pageAuthToggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      isPageSignUpMode = !isPageSignUpMode;
      if (isPageSignUpMode) {
        pageAuthTitle.innerText = "Create your account";
        pageAuthSubtitle.innerText = "Join Sous-Chef Pro — we'll set up your personal cloud database.";
        pageAuthNameGroup.style.display = "flex";
        pageAuthSubmitBtn.innerHTML = '<span>Create Account</span><i class="fa-solid fa-arrow-right"></i>';
        pageAuthToggleLink.innerHTML = 'Already have an account? <strong>Sign In</strong>';
        document.getElementById("page-auth-input-name").required = true;
      } else {
        pageAuthTitle.innerText = "Welcome back";
        pageAuthSubtitle.innerText = "Sign in to sync your recipes, planner & meal logs.";
        pageAuthNameGroup.style.display = "none";
        pageAuthSubmitBtn.innerHTML = '<span>Sign In</span><i class="fa-solid fa-arrow-right"></i>';
        pageAuthToggleLink.innerHTML = 'Don\'t have an account? <strong>Sign Up</strong>';
        document.getElementById("page-auth-input-name").required = false;
      }
    });
  }

  if (pageAuthForm) {
    pageAuthForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("page-auth-input-email").value.trim();
      const password = document.getElementById("page-auth-input-password").value;
      const name = document.getElementById("page-auth-input-name").value.trim();

      pageAuthSubmitBtn.disabled = true;
      pageAuthSubmitBtn.innerHTML = isPageSignUpMode ? '<span>Creating account…</span>' : '<span>Signing in…</span>';

      try {
        if (isPageSignUpMode) {
          const data = await SupabaseService.signUp(email, password, name);

          // Check if Supabase returned a user that still needs email confirmation
          if (data?.user && !data.session) {
            alert("Account created! Please check your email inbox and confirm your address before signing in.\n\nTip: If you want to skip email confirmation, go to your Supabase dashboard → Authentication → Providers → Email → disable 'Confirm email'.");
          } else {
            alert("Account created and signed in! Your personal cloud database is being initialized…");
            pageAuthForm.reset();
            checkAuthState();
          }
        } else {
          await SupabaseService.signIn(email, password);
          alert("Welcome back! Loading cloud synced data…");
          pageAuthForm.reset();
          checkAuthState();
        }
      } catch (error) {
        if (error.message && error.message.toLowerCase().includes("email not confirmed")) {
          alert("Your email address hasn't been confirmed yet.\n\n• Check your inbox for a confirmation link from Supabase.\n• Or go to your Supabase dashboard → Authentication → Providers → Email → disable 'Confirm email' to skip this step.");
        } else {
          alert("Auth Error: " + error.message);
        }
      } finally {
        pageAuthSubmitBtn.disabled = false;
        pageAuthSubmitBtn.innerHTML = isPageSignUpMode
          ? '<span>Create Account</span><i class="fa-solid fa-arrow-right"></i>'
          : '<span>Sign In</span><i class="fa-solid fa-arrow-right"></i>';
      }
    });
  }

  // Auth State UI toggling
  function checkAuthState() {
    const authPage = document.getElementById("auth-page");
    const appContainer = document.querySelector(".app-container");
    const mobileHeader = document.getElementById("mobile-header");

    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      if (authPage) authPage.style.display = "none";
      if (appContainer) appContainer.style.display = "flex";
      
      // Sync names to UI upon login
      if (window.ProfileModule && typeof window.ProfileModule.updateStatus === "function") {
        window.ProfileModule.updateStatus();
      }
      
      // Determine if mobile header should display
      if (mobileHeader) {
        if (window.innerWidth <= 768) {
          mobileHeader.style.display = "flex";
        } else {
          mobileHeader.style.display = "none";
        }
      }
    } else {
      if (authPage) authPage.style.display = "flex";
      if (appContainer) appContainer.style.display = "none";
      if (mobileHeader) mobileHeader.style.display = "none";
    }
  }

  // Hook resize event and auth change events
  window.addEventListener("resize", checkAuthState);
  window.addEventListener("supabaseAuthChanged", () => {
    checkAuthState();
    // Re-render dashboard or active screen
    const activeItem = document.querySelector(".nav-menu .nav-item.active");
    if (activeItem) {
      triggerSectionReload(activeItem.getAttribute("data-view"));
    }
  });

  // Call immediately to assert correct initial screen
  setTimeout(checkAuthState, 100);

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
