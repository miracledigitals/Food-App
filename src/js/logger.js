const LoggerModule = {
  selectedTags: new Set(),
  uploadedFile: null,

  init() {
    // 1. Drag and Drop Uploader
    const dropzone = document.getElementById("photo-dropzone");
    const fileInput = document.getElementById("file-uploader");

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelected(e.target.files[0]);
      }
    });

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--primary-color)";
      dropzone.style.backgroundColor = "var(--primary-light)";
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.style.borderColor = "var(--border-color)";
      dropzone.style.backgroundColor = "var(--bg-card)";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--border-color)";
      dropzone.style.backgroundColor = "var(--bg-card)";
      if (e.dataTransfer.files.length > 0) {
        this.handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    // 2. AI Scanner Trigger
    const btnScan = document.getElementById("btn-trigger-ai-scan");
    btnScan.addEventListener("click", () => {
      this.runAIScanner();
    });

    // 3. Sliders Dynamic Updating
    this.bindSliders();

    // 4. Tag selection toggle
    const tagOptions = document.querySelectorAll("#logger-tags-container .tag-option");
    tagOptions.forEach(opt => {
      opt.addEventListener("click", () => {
        const tag = opt.getAttribute("data-tag");
        if (opt.classList.contains("selected")) {
          opt.classList.remove("selected");
          this.selectedTags.delete(tag);
        } else {
          opt.classList.add("selected");
          this.selectedTags.add(tag);
        }
      });
    });

    // 5. Form Submission (Save Logged Meal)
    const form = document.getElementById("logger-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveLog();
    });

    // 6. Schedule to Plan Button
    const btnSchedule = document.getElementById("btn-schedule-logged");
    btnSchedule.addEventListener("click", () => {
      this.scheduleToPlanner();
    });

    // Initialize Form values
    this.initForm();
  },

  handleFileSelected(file) {
    this.uploadedFile = file;
    const dropzone = document.getElementById("photo-dropzone");
    dropzone.innerHTML = `
      <i class="fa-solid fa-circle-check" style="font-size: 48px; color: var(--primary-color);"></i>
      <div class="uploader-title">Photo Uploaded!</div>
      <div class="uploader-subtitle" style="font-weight: 700;">${file.name}</div>
      <button class="btn btn-secondary btn-sm" id="btn-remove-photo" style="margin-top: 8px;">Change photo</button>
    `;
    
    // Rebind dropzone change
    document.getElementById("btn-remove-photo").addEventListener("click", (e) => {
      e.stopPropagation();
      this.resetUploader();
    });
  },

  resetUploader() {
    this.uploadedFile = null;
    const dropzone = document.getElementById("photo-dropzone");
    dropzone.innerHTML = `
      <i class="fa-solid fa-cloud-arrow-up uploader-icon"></i>
      <div class="uploader-title">Drag and drop food photo here</div>
      <div class="uploader-subtitle">Or click to select an image from your computer</div>
      <input type="file" id="file-uploader" style="display: none;" accept="image/*">
    `;
    // Rebind click
    const fileInput = document.getElementById("file-uploader");
    dropzone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelected(e.target.files[0]);
      }
    });
  },

  runAIScanner() {
    const descText = document.getElementById("logger-text-description").value.trim().toLowerCase();
    
    // Check if input exists
    if (!this.uploadedFile && descText === "") {
      alert("Please upload a food photo or enter a meal description first!");
      return;
    }

    const scanner = document.getElementById("logger-scanner");
    scanner.classList.add("active");

    const statusText = document.getElementById("scanner-status-text");
    const steps = [
      document.getElementById("scan-step-1"),
      document.getElementById("scan-step-2"),
      document.getElementById("scan-step-3"),
      document.getElementById("scan-step-4")
    ];

    // Reset scan steps state
    steps.forEach(s => {
      s.classList.remove("done");
      s.querySelector("i").className = "fa-regular fa-circle";
    });

    // Simulate analysis sequence
    statusText.innerText = "Analyzing photo and description...";

    setTimeout(() => {
      steps[0].classList.add("done");
      steps[0].querySelector("i").className = "fa-solid fa-circle-check";
      statusText.innerText = "Extracting ingredients...";
    }, 1000);

    setTimeout(() => {
      steps[1].classList.add("done");
      steps[1].querySelector("i").className = "fa-solid fa-circle-check";
      statusText.innerText = "Calculating caloric density...";
    }, 2200);

    setTimeout(() => {
      steps[2].classList.add("done");
      steps[2].querySelector("i").className = "fa-solid fa-circle-check";
      statusText.innerText = "Formulating macronutrient composition...";
    }, 3400);

    setTimeout(() => {
      steps[3].classList.add("done");
      steps[3].querySelector("i").className = "fa-solid fa-circle-check";
      statusText.innerText = "Optimizing nutritional metrics...";
    }, 4400);

    setTimeout(() => {
      scanner.classList.remove("active");
      this.populateAIScannedResults(descText);
    }, 5200);
  },

  populateAIScannedResults(description) {
    let name = "AI Healthy Harvest Bowl";
    let cal = 550;
    let prot = 28;
    let carb = 55;
    let fat = 15;
    let autoTags = [];

    // Simple NLP heuristic rules for dynamic AI feel
    if (description.includes("salmon")) {
      name = "Lemon Grilled Salmon Salad";
      cal = 450;
      prot = 38;
      carb = 12;
      fat = 28;
      autoTags = ["High Protein", "Gluten Free"];
    } else if (description.includes("avocado") || description.includes("toast")) {
      name = "Smashed Avocado Egg Toast";
      cal = 380;
      prot = 16;
      carb = 32;
      fat = 22;
      autoTags = ["Breakfast", "Under 30 Mins"];
    } else if (description.includes("salad") || description.includes("quinoa")) {
      name = "Mediterranean Quinoa Bowl";
      cal = 320;
      prot = 10;
      carb = 42;
      fat = 14;
      autoTags = ["Vegan", "Under 30 Mins"];
    } else if (description.includes("pancake") || description.includes("banana")) {
      name = "Protein Banana Oat Pancakes";
      cal = 420;
      prot = 28;
      carb = 48;
      fat = 12;
      autoTags = ["High Protein", "Breakfast"];
    } else if (description.includes("tofu") || description.includes("vegan")) {
      name = "Crispy Sesame Tofu Rice Bowl";
      cal = 520;
      prot = 22;
      carb = 65;
      fat = 18;
      autoTags = ["Vegan", "Meal Prep"];
    } else if (description.includes("smoothie") || description.includes("berry")) {
      name = "Berry Whey Protein Shake";
      cal = 290;
      prot = 26;
      carb = 34;
      fat = 5;
      autoTags = ["Under 30 Mins", "High Protein"];
    }

    // Set form fields
    document.getElementById("log-meal-name").value = name;
    
    // Sliders
    document.getElementById("slider-cal").value = cal;
    document.getElementById("slider-prot").value = prot;
    document.getElementById("slider-carb").value = carb;
    document.getElementById("slider-fat").value = fat;
    
    this.updateSliderLabels();

    // Select tags automatically
    const tagOptions = document.querySelectorAll("#logger-tags-container .tag-option");
    this.selectedTags.clear();
    tagOptions.forEach(opt => {
      const tag = opt.getAttribute("data-tag");
      if (autoTags.includes(tag)) {
        opt.classList.add("selected");
        this.selectedTags.add(tag);
      } else {
        opt.classList.remove("selected");
      }
    });

    alert("Sous-Chef AI completed analysis! Metrics pre-populated.");
  },

  bindSliders() {
    const sliders = [
      { slider: "slider-cal", val: "slider-cal-val", suffix: " kcal" },
      { slider: "slider-prot", val: "slider-prot-val", suffix: "g" },
      { slider: "slider-carb", val: "slider-carb-val", suffix: "g" },
      { slider: "slider-fat", val: "slider-fat-val", suffix: "g" }
    ];

    sliders.forEach(item => {
      const sEl = document.getElementById(item.slider);
      const vEl = document.getElementById(item.val);
      if (sEl && vEl) {
        sEl.addEventListener("input", () => {
          vEl.innerText = `${sEl.value}${item.suffix}`;
        });
      }
    });
  },

  updateSliderLabels() {
    document.getElementById("slider-cal-val").innerText = document.getElementById("slider-cal").value + " kcal";
    document.getElementById("slider-prot-val").innerText = document.getElementById("slider-prot").value + "g";
    document.getElementById("slider-carb-val").innerText = document.getElementById("slider-carb").value + "g";
    document.getElementById("slider-fat-val").innerText = document.getElementById("slider-fat").value + "g";
  },

  initForm() {
    // Reset inputs
    document.getElementById("log-meal-name").value = "";
    document.getElementById("logger-text-description").value = "";
    this.resetUploader();

    document.getElementById("slider-cal").value = 400;
    document.getElementById("slider-prot").value = 25;
    document.getElementById("slider-carb").value = 40;
    document.getElementById("slider-fat").value = 12;

    this.updateSliderLabels();

    // Clear tag selection
    const tagOptions = document.querySelectorAll("#logger-tags-container .tag-option");
    tagOptions.forEach(opt => opt.classList.remove("selected"));
    this.selectedTags.clear();

    // Reset timestamp
    const logTimeField = document.getElementById("log-meal-time");
    if (logTimeField) {
      const now = new Date();
      const offsetNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      logTimeField.value = offsetNow;
    }
  },

  saveLog() {
    const name = document.getElementById("log-meal-name").value;
    const mealType = document.getElementById("log-meal-type").value;
    const timestamp = new Date(document.getElementById("log-meal-time").value).toISOString();

    const calories = document.getElementById("slider-cal").value;
    const protein = document.getElementById("slider-prot").value;
    const carbs = document.getElementById("slider-carb").value;
    const fats = document.getElementById("slider-fat").value;

    State.logMeal({
      name,
      mealType,
      timestamp,
      calories,
      protein,
      carbs,
      fats,
      tags: Array.from(this.selectedTags)
    });

    alert(`Successfully logged "${name}" to database!`);
    
    // Redirect / Go to dashboard
    this.initForm();
    
    // Trigger UI switch back to dashboard via app controller click
    const dashNavItem = document.querySelector(".nav-menu .nav-item[data-view='dashboard']");
    if (dashNavItem) {
      dashNavItem.click();
    }
  },

  scheduleToPlanner() {
    const name = document.getElementById("log-meal-name").value;
    if (!name || name.trim() === "") {
      alert("Please enter a meal name to schedule!");
      return;
    }

    const day = prompt("Which day of the week would you like to schedule this meal for?\n(e.g., monday, tuesday, wednesday, thursday, friday, saturday, sunday)", "wednesday");
    if (!day) return;
    
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    if (!validDays.includes(day.toLowerCase().trim())) {
      alert("Invalid day entered. Please try again.");
      return;
    }

    const slot = document.getElementById("log-meal-type").value;

    const calories = document.getElementById("slider-cal").value;
    const protein = document.getElementById("slider-prot").value;
    const carbs = document.getElementById("slider-carb").value;
    const fats = document.getElementById("slider-fat").value;

    State.addMealToPlan(day.toLowerCase().trim(), slot, {
      name, calories, protein, carbs, fats
    });

    alert(`Successfully scheduled "${name}" into ${day}'s ${slot}!`);
  }
};

// Bind to window load
document.addEventListener("DOMContentLoaded", () => {
  LoggerModule.init();
  window.LoggerModule = LoggerModule;
});
