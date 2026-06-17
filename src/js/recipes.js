const RecipesModule = {
  currentFilter: "All",
  activeRecipeIdForDetails: null,

  init() {
    // Search filter
    const searchInput = document.getElementById("recipe-search");
    searchInput.addEventListener("input", () => {
      this.render();
    });

    // Category filter tabs
    const tabs = document.querySelectorAll("#recipe-filter-tabs .filter-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.currentFilter = tab.getAttribute("data-view") || tab.getAttribute("data-filter");
        this.render();
      });
    });

    // Import recipe button (Header)
    const importBtn = document.getElementById("btn-import-recipe");
    importBtn.addEventListener("click", () => {
      this.resetImportForm();
      openModal("modal-recipe-import");
    });

    // Import tab toggles
    const tabScratch = document.getElementById("btn-import-tab-scratch");
    const tabUrl = document.getElementById("btn-import-tab-url");
    const segmentUrl = document.getElementById("import-segment-url");
    const segmentManual = document.getElementById("import-segment-manual");

    tabScratch.addEventListener("click", () => {
      tabScratch.className = "btn btn-sm btn-primary";
      tabUrl.className = "btn btn-sm btn-secondary";
      segmentUrl.style.display = "none";
      segmentManual.style.display = "flex";
    });

    tabUrl.addEventListener("click", () => {
      tabScratch.className = "btn btn-sm btn-secondary";
      tabUrl.className = "btn btn-sm btn-primary";
      segmentUrl.style.display = "flex";
      segmentManual.style.display = "flex"; // Keep manual open for autofill review!
    });

    // Scraper Simulation click
    const btnScrape = document.getElementById("btn-trigger-url-scrape");
    btnScrape.addEventListener("click", () => {
      const urlVal = document.getElementById("import-recipe-url").value;
      if (!urlVal || urlVal.trim() === "") {
        alert("Please enter a valid recipe URL to analyze!");
        return;
      }
      this.runMockScraper();
    });

    // Import recipe form submit
    const importForm = document.getElementById("recipe-import-form");
    importForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitImportedRecipe();
    });

    // Detail Modal schedule button
    const detailScheduleBtn = document.getElementById("btn-details-schedule");
    detailScheduleBtn.addEventListener("click", () => {
      const recipe = State.data.recipes.find(r => r.id === this.activeRecipeIdForDetails);
      if (recipe) {
        this.scheduleRecipe(recipe);
        closeModal("modal-recipe-details");
      }
    });
  },

  render() {
    const container = document.getElementById("recipes-grid-container");
    container.innerHTML = "";

    const searchQuery = document.getElementById("recipe-search").value.toLowerCase().trim();
    const recipes = State.data.recipes;

    // Filter recipes
    const filteredRecipes = recipes.filter(recipe => {
      // 1. Search Query filter
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery) ||
                            recipe.description.toLowerCase().includes(searchQuery) ||
                            recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery));

      if (!matchesSearch) return false;

      // 2. Category tab filter
      if (this.currentFilter === "All") return true;
      if (this.currentFilter === "Favorites") return recipe.favorite;
      
      // Matches tags
      return recipe.tags.some(t => t.toLowerCase() === this.currentFilter.toLowerCase());
    });

    if (filteredRecipes.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 48px; margin-bottom: 16px; color: var(--border-color);"></i>
          <div>No recipes found matching current filters.</div>
        </div>
      `;
      return;
    }

    filteredRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      
      // Tags rendering
      let tagsHtml = "";
      recipe.tags.slice(0, 2).forEach(t => {
        tagsHtml += `<span class="badge badge-primary">${t}</span>`;
      });

      card.innerHTML = `
        <div class="recipe-card-image" style="background-image: url('${recipe.imageUrl}');">
          <button class="recipe-card-fav ${recipe.favorite ? 'active' : ''}" data-id="${recipe.id}" title="${recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}">
            <i class="${recipe.favorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>
        <div class="recipe-card-content">
          <div class="recipe-card-tags">
            ${tagsHtml}
          </div>
          <h3 class="recipe-card-title">${recipe.name}</h3>
          <div class="recipe-card-meta">
            <span><i class="fa-regular fa-clock"></i> ${recipe.cookTime} Mins</span>
            <span><i class="fa-solid fa-fire"></i> ${recipe.calories} kcal</span>
          </div>
          <div class="recipe-card-macros">
            <div class="recipe-macro-item">
              <span class="recipe-macro-value" style="color: var(--color-protein);">${recipe.protein}g</span>
              <span class="recipe-macro-label">Prot</span>
            </div>
            <div class="recipe-macro-item">
              <span class="recipe-macro-value" style="color: var(--color-carbs);">${recipe.carbs}g</span>
              <span class="recipe-macro-label">Carb</span>
            </div>
            <div class="recipe-macro-item">
              <span class="recipe-macro-value" style="color: var(--color-fats);">${recipe.fats}g</span>
              <span class="recipe-macro-label">Fat</span>
            </div>
          </div>
        </div>
        <div class="recipe-card-actions">
          <button class="btn btn-secondary btn-sm btn-details" data-id="${recipe.id}"><i class="fa-solid fa-circle-info"></i> Details</button>
          <button class="btn btn-primary btn-sm btn-schedule" data-id="${recipe.id}"><i class="fa-solid fa-plus"></i> Schedule</button>
        </div>
      `;

      // Bind Favorite toggle
      card.querySelector(".recipe-card-fav").addEventListener("click", (e) => {
        e.stopPropagation();
        State.toggleFavorite(recipe.id);
        this.render();
      });

      // Bind details popup
      card.querySelector(".btn-details").addEventListener("click", () => {
        this.showDetails(recipe.id);
      });

      // Bind direct schedule
      card.querySelector(".btn-schedule").addEventListener("click", () => {
        this.scheduleRecipe(recipe);
      });

      container.appendChild(card);
    });
  },

  showDetails(id) {
    const recipe = State.data.recipes.find(r => r.id === id);
    if (!recipe) return;

    this.activeRecipeIdForDetails = id;

    // Title & description
    document.getElementById("recipe-details-title").innerText = recipe.name;
    document.getElementById("recipe-details-desc").innerText = recipe.description || "No description provided.";
    
    // Image
    const imgEl = document.getElementById("recipe-details-image");
    imgEl.style.backgroundImage = `url('${recipe.imageUrl}')`;

    // Favorite button inside modal header/image
    const favContainer = document.getElementById("recipe-details-fav-container");
    favContainer.innerHTML = `
      <button class="recipe-card-fav ${recipe.favorite ? 'active' : ''}" style="width: 38px; height: 38px; font-size: 16px;">
        <i class="${recipe.favorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
    `;
    favContainer.querySelector("button").addEventListener("click", () => {
      State.toggleFavorite(recipe.id);
      this.showDetails(recipe.id);
      this.render(); // Update grid behind modal
    });

    // Macros
    document.getElementById("details-cal").innerText = recipe.calories;
    document.getElementById("details-prot").innerText = recipe.protein + "g";
    document.getElementById("details-carb").innerText = recipe.carbs + "g";
    document.getElementById("details-fat").innerText = recipe.fats + "g";

    // Ingredients
    const ingList = document.getElementById("recipe-details-ingredients");
    ingList.innerHTML = "";
    recipe.ingredients.forEach(ing => {
      const li = document.createElement("li");
      li.innerText = `${ing.name} (${ing.qty})`;
      ingList.appendChild(li);
    });

    // Instructions
    const instList = document.getElementById("recipe-details-instructions");
    instList.innerHTML = "";
    recipe.instructions.forEach(step => {
      const li = document.createElement("li");
      li.innerText = step;
      instList.appendChild(li);
    });

    openModal("modal-recipe-details");
  },

  scheduleRecipe(recipe) {
    const day = prompt(`Schedule "${recipe.name}" for which day?\n(e.g., monday, tuesday, wednesday, thursday, friday, saturday, sunday)`, "wednesday");
    if (!day) return;
    
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    if (!validDays.includes(day.toLowerCase().trim())) {
      alert("Invalid day entered.");
      return;
    }

    const slot = prompt(`Which meal slot? (breakfast, lunch, dinner, snack)`, "lunch");
    if (!slot) return;
    
    const validSlots = ["breakfast", "lunch", "dinner", "snack"];
    if (!validSlots.includes(slot.toLowerCase().trim())) {
      alert("Invalid meal slot.");
      return;
    }

    State.addMealToPlan(day.toLowerCase().trim(), slot.toLowerCase().trim(), recipe);
    alert(`Successfully planned ${recipe.name} for ${day}'s ${slot}!`);
  },

  resetImportForm() {
    document.getElementById("recipe-import-form").reset();
    
    // Switch tabs to Scratch by default
    document.getElementById("btn-import-tab-scratch").click();
  },

  runMockScraper() {
    const scraperBtn = document.getElementById("btn-trigger-url-scrape");
    const originalText = scraperBtn.innerText;
    
    scraperBtn.disabled = true;
    scraperBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i>Scraping website markup...`;

    setTimeout(() => {
      // Mock scrape autofill
      document.getElementById("import-name").value = "Garlic Lemon Butter Shrimp";
      document.getElementById("import-desc").value = "Succulent shrimp sautéed in a garlic-lemon butter reduction. Quick, low carb, and packed with savory flavor.";
      document.getElementById("import-time").value = 15;
      document.getElementById("import-cal").value = 310;
      document.getElementById("import-prot").value = 34;
      document.getElementById("import-carb").value = 5;
      document.getElementById("import-fat").value = 18;
      
      document.getElementById("import-primary-tag").value = "High Protein";
      
      document.getElementById("import-ingredients").value = 
        "400g Large Shrimp (peeled and deveined)\n3 tbsp Butter (salted)\n4 cloves Garlic (minced)\n1/2 Lemon (juiced)\n1 tbsp Fresh parsley (chopped)";
      
      document.getElementById("import-instructions").value = 
        "Rinse and dry the shrimp with paper towels.\nMelt butter in a large skillet over medium-high heat.\nAdd minced garlic and cook until aromatic, about 1 minute.\nAdd shrimp in a single layer and cook for 2 minutes on each side.\nPour in fresh lemon juice and toss to coat. Garnish with chopped parsley.";

      scraperBtn.disabled = false;
      scraperBtn.innerHTML = originalText;
      alert("Autofilled recipe from web scraper parsing!");
    }, 2000);
  },

  submitImportedRecipe() {
    const name = document.getElementById("import-name").value;
    const description = document.getElementById("import-desc").value;
    const cookTime = document.getElementById("import-time").value;
    const calories = document.getElementById("import-cal").value;
    const protein = document.getElementById("import-prot").value;
    const carbs = document.getElementById("import-carb").value;
    const fats = document.getElementById("import-fat").value;
    const primaryTag = document.getElementById("import-primary-tag").value;
    
    // Parse ingredients
    const ingText = document.getElementById("import-ingredients").value.split("\n");
    const ingredients = ingText
      .filter(line => line.trim() !== "")
      .map(line => {
        // Simple parser to separate quantities from name.
        // Let's assume the first word could be the quantity.
        const words = line.trim().split(" ");
        const qty = words[0];
        const ingName = words.slice(1).join(" ");
        // Guess category based on ingredients name
        let category = "Pantry";
        const n = ingName.toLowerCase();
        if (n.includes("chicken") || n.includes("shrimp") || n.includes("beef") || n.includes("fish") || n.includes("egg") || n.includes("tofu")) {
          category = "Protein";
        } else if (n.includes("parsley") || n.includes("garlic") || n.includes("lemon") || n.includes("onion") || n.includes("asparagus") || n.includes("spinach") || n.includes("berry")) {
          category = "Produce";
        } else if (n.includes("butter") || n.includes("feta") || n.includes("milk") || n.includes("cheese") || n.includes("cottage")) {
          category = "Dairy";
        }
        return { name: ingName || qty, qty: qty, category: category };
      });

    // Parse instructions
    const instText = document.getElementById("import-instructions").value.split("\n");
    const instructions = instText.filter(line => line.trim() !== "");

    // Mock an image URL for the recipe
    let mockImg = "./assets/placeholder_food.jpg";
    if (name.toLowerCase().includes("shrimp")) {
      mockImg = "./assets/garlic_butter_shrimp.jpg";
    }

    State.addRecipe({
      name,
      description,
      cookTime,
      calories,
      protein,
      carbs,
      fats,
      tags: [primaryTag, cookTime < 30 ? "Under 30 Mins" : "Meal Prep"],
      ingredients,
      instructions,
      imageUrl: mockImg
    });

    closeModal("modal-recipe-import");
    this.render();
    alert(`Successfully added "${name}" to your library!`);
  }
};

// Bind to window load
document.addEventListener("DOMContentLoaded", () => {
  RecipesModule.init();
  window.RecipesModule = RecipesModule;
});
