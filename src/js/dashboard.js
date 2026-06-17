const DashboardModule = {
  activeDay: null,
  activeType: null,

  init() {
    // Event listener for planner custom form submit
    const customForm = document.getElementById("planner-custom-form");
    customForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("plan-custom-name").value;
      const calories = document.getElementById("plan-custom-cal").value;
      const protein = document.getElementById("plan-custom-prot").value;
      const carbs = document.getElementById("plan-custom-carb").value;
      const fats = document.getElementById("plan-custom-fat").value;

      State.addMealToPlan(this.activeDay, this.activeType, {
        name, calories, protein, carbs, fats
      });

      closeModal("modal-planner-choose");
      this.render();
    });

    // Event listener for recipe selector submit
    const submitRecipeBtn = document.getElementById("btn-submit-planner-recipe");
    submitRecipeBtn.addEventListener("click", () => {
      const select = document.getElementById("planner-select-recipe");
      const recipeId = select.value;
      const recipe = State.data.recipes.find(r => r.id === recipeId);
      
      if (recipe) {
        State.addMealToPlan(this.activeDay, this.activeType, recipe);
      }
      
      closeModal("modal-planner-choose");
      this.render();
    });

    // Chef suggestion add to plan
    const addSuggestionBtn = document.getElementById("btn-add-suggestion");
    addSuggestionBtn.addEventListener("click", () => {
      const suggestName = document.getElementById("suggest-name").innerText;
      const matchingRecipe = State.data.recipes.find(r => r.name === suggestName);
      if (matchingRecipe) {
        // Find first empty lunch or dinner slot today (Wednesday is default today)
        const today = "wednesday";
        const planner = State.data.weeklyPlanner[today] || {};
        let slot = "lunch";
        if (planner.lunch) {
          slot = planner.dinner ? "snack" : "dinner";
        }
        State.addMealToPlan(today, slot, matchingRecipe);
        this.render();
        alert(`Added ${matchingRecipe.name} to Wednesday ${slot}!`);
      }
    });

    // Bind event listeners to empty cell clicks
    const cells = document.querySelectorAll(".meal-cell");
    cells.forEach(cell => {
      cell.addEventListener("click", (e) => {
        // Prevent click if clicking delete button
        if (e.target.classList.contains("meal-item-delete")) return;

        const day = cell.getAttribute("data-day");
        const type = cell.getAttribute("data-type");

        const hasMeal = cell.classList.contains("filled");
        if (hasMeal) {
          // View recipe details if it's a preloaded recipe
          const plannerMeal = State.data.weeklyPlanner[day][type];
          if (plannerMeal && plannerMeal.id && !plannerMeal.id.startsWith("custom-")) {
            if (window.RecipesModule && typeof window.RecipesModule.showDetails === "function") {
              window.RecipesModule.showDetails(plannerMeal.id);
            }
          }
        } else {
          // Open Modal to schedule a meal
          this.activeDay = day;
          this.activeType = type;
          
          document.getElementById("planner-modal-header-text").innerText = `Add Meal - ${day.charAt(0).toUpperCase() + day.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
          
          // Reset form fields
          document.getElementById("plan-custom-name").value = "";
          
          // Populate recipes dropdown
          const select = document.getElementById("planner-select-recipe");
          select.innerHTML = "";
          State.data.recipes.forEach(recipe => {
            const opt = document.createElement("option");
            opt.value = recipe.id;
            opt.innerText = `${recipe.name} (${recipe.calories} kcal)`;
            select.appendChild(opt);
          });

          openModal("modal-planner-choose");
        }
      });
    });
  },

  render() {
    // 1. Get targets
    const targets = State.data.settings;

    // 2. Fetch logged meals for "Today" (June 17, 2026 is a Wednesday)
    // We match timestamps that start with "2026-06-17"
    const todayStr = "2026-06-17";
    const todaysLogs = State.data.loggedMeals.filter(log => log.timestamp.startsWith(todayStr));
    
    let loggedCal = 0;
    let loggedProt = 0;
    let loggedCarb = 0;
    let loggedFat = 0;

    todaysLogs.forEach(log => {
      loggedCal += log.calories;
      loggedProt += log.protein;
      loggedCarb += log.carbs;
      loggedFat += log.fats;
    });

    // 3. Render Today's summary progress bars
    document.getElementById("sum-cal-value").innerText = `${loggedCal} / ${targets.calories} kcal`;
    const calPct = Math.min(100, Math.round((loggedCal / targets.calories) * 100));
    document.getElementById("sum-cal-progress").style.width = `${calPct}%`;

    document.getElementById("sum-prot-value").innerText = `${loggedProt} / ${targets.protein}g`;
    const protPct = Math.min(100, Math.round((loggedProt / targets.protein) * 100));
    document.getElementById("sum-prot-progress").style.width = `${protPct}%`;

    document.getElementById("sum-carb-value").innerText = `${loggedCarb} / ${targets.carbs}g`;
    const carbPct = Math.min(100, Math.round((loggedCarb / targets.carbs) * 100));
    document.getElementById("sum-carb-progress").style.width = `${carbPct}%`;

    document.getElementById("sum-fat-value").innerText = `${loggedFat} / ${targets.fats}g`;
    const fatPct = Math.min(100, Math.round((loggedFat / targets.fats) * 100));
    document.getElementById("sum-fat-progress").style.width = `${fatPct}%`;

    // 4. Update the 7-Day Meal Planner Grid cells
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
    let plannedCount = 0;

    days.forEach(day => {
      const plannerDay = State.data.weeklyPlanner[day] || {};
      mealTypes.forEach(type => {
        const cell = document.querySelector(`.meal-cell[data-day="${day}"][data-type="${type}"]`);
        if (!cell) return;

        const meal = plannerDay[type];
        if (meal) {
          plannedCount++;
          cell.classList.add("filled");
          cell.innerHTML = `
            <div class="meal-item-title">${meal.name}</div>
            <div class="meal-item-calories">${meal.calories} kcal</div>
            <div class="meal-item-delete" title="Delete meal plan">&times;</div>
          `;

          // Bind delete click
          cell.querySelector(".meal-item-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Remove ${meal.name} from your schedule?`)) {
              State.removeMealFromPlan(day, type);
              this.render();
            }
          });
        } else {
          cell.classList.remove("filled");
          cell.innerHTML = `
            <div class="meal-cell-add-icon"><i class="fa-solid fa-plus"></i></div>
            <div class="meal-cell-empty-text">Add ${type}</div>
          `;
        }
      });
    });

    document.getElementById("dashboard-plan-status").innerText = `${plannedCount} / 28 Slots Planned`;

    // 5. Render Nutritional Balance (SVG Donut Chart)
    const totalGrams = loggedProt + loggedCarb + loggedFat;
    let carbsPctVal = 40;
    let protPctVal = 35;
    let fatsPctVal = 25;

    if (totalGrams > 0) {
      carbsPctVal = Math.round((loggedCarb / totalGrams) * 100);
      protPctVal = Math.round((loggedProt / totalGrams) * 100);
      // Ensure it adds up to 100
      fatsPctVal = 100 - carbsPctVal - protPctVal;
    }

    document.getElementById("label-carbs-percent").innerText = `${carbsPctVal}%`;
    document.getElementById("label-protein-percent").innerText = `${protPctVal}%`;
    document.getElementById("label-fats-percent").innerText = `${fatsPctVal}%`;
    document.getElementById("donut-center-text").textContent = totalGrams > 0 ? `${totalGrams}g` : "0g";

    // Set SVG Dasharrays for donut chart segment rendering
    // SVG radius is 15.91549430918954 => Circumference is exactly 100.
    const carbsSeg = document.getElementById("donut-carbs-segment");
    const protSeg = document.getElementById("donut-protein-segment");
    const fatsSeg = document.getElementById("donut-fats-segment");

    // Dash offsets:
    // Carbs starts at 25 offset
    carbsSeg.setAttribute("stroke-dasharray", `${carbsPctVal} ${100 - carbsPctVal}`);
    carbsSeg.setAttribute("stroke-dashoffset", "25");

    // Protein starts after carbs
    protSeg.setAttribute("stroke-dasharray", `${protPctVal} ${100 - protPctVal}`);
    protSeg.setAttribute("stroke-dashoffset", `${25 - carbsPctVal}`);

    // Fats starts after protein
    fatsSeg.setAttribute("stroke-dasharray", `${fatsPctVal} ${100 - fatsPctVal}`);
    fatsSeg.setAttribute("stroke-dashoffset", `${25 - carbsPctVal - protPctVal}`);

    // 6. Chef's Suggestion reload logic
    this.reloadChefSuggestion();
  },

  reloadChefSuggestion() {
    // Pick a recipe that is favorited or just randomly select one from state recipes
    const recipes = State.data.recipes;
    if (recipes.length > 0) {
      // Find a healthy high protein recommendation or pick index 1 (Salmon)
      const salmon = recipes.find(r => r.id === "rec-salmon") || recipes[0];
      
      const imgDiv = document.getElementById("suggest-img");
      const nameDiv = document.getElementById("suggest-name");
      const metaDiv = document.getElementById("widget-chef-suggestion");

      if (imgDiv && nameDiv) {
        imgDiv.style.backgroundImage = `url('${salmon.imageUrl}')`;
        imgDiv.innerHTML = `<span class="suggestion-tag">${salmon.tags[0] || 'Chef\'s Pick'}</span>`;
        nameDiv.innerText = salmon.name;
        
        const metaSpan = metaDiv.querySelector(".suggestion-meta");
        if (metaSpan) {
          metaSpan.innerHTML = `
            <span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${salmon.cookTime} Mins</span>
            <span style="margin-left: 12px;"><i class="fa-solid fa-fire" style="margin-right: 4px;"></i>${salmon.calories} kcal</span>
          `;
        }
      }
    }
  }
};

// Bind to window load
document.addEventListener("DOMContentLoaded", () => {
  DashboardModule.init();
  window.DashboardModule = DashboardModule;
});
