const RecipesModule = {
  currentFilter: "All",
  activeRecipeIdForDetails: null,

  nifodaRecipes: [
    {
      id: "nif-jollof",
      name: "Classic Nigerian Jollof Rice",
      description: "An iconic West African rice dish cooked in a rich, flavorful tomato, red bell pepper, and onion reduction with select spices.",
      cookTime: 45,
      calories: 420,
      protein: 12,
      carbs: 68,
      fats: 11,
      tags: ["Nigerian", "Meal Prep"],
      ingredients: [
        { name: "Long-grain parboiled rice", qty: "400g", category: "Pantry" },
        { name: "Large Tomatoes", qty: "4", category: "Produce" },
        { name: "Red bell peppers (Tatashe)", qty: "2", category: "Produce" },
        { name: "Scotch bonnet pepper (Ata rodo)", qty: "1", category: "Produce" },
        { name: "Medium red onions", qty: "2", category: "Produce" },
        { name: "Tomato paste", qty: "3 tbsp", category: "Pantry" },
        { name: "Vegetable oil", qty: "100ml", category: "Pantry" },
        { name: "Chicken stock", qty: "500ml", category: "Protein" },
        { name: "Bay leaves", qty: "2", category: "Pantry" },
        { name: "Curry powder & Dried thyme", qty: "1 tsp each", category: "Pantry" }
      ],
      instructions: [
        "Blend the tomatoes, red bell peppers, Scotch bonnet, and one onion until smooth. Boil the mixture down to reduce moisture.",
        "Heat vegetable oil in a large pot, slice the second onion, and fry until transparent. Add the tomato paste and fry for 5 minutes.",
        "Pour in the boiled pepper blend and fry until the oil separates from the sauce.",
        "Add chicken stock, bay leaves, curry powder, thyme, salt, and seasoning. Bring to a boil.",
        "Wash the rice thoroughly with warm water, add it to the pot, cover tightly (using foil for steam capture), and simmer on low heat for 30 minutes until soft.",
        "Stir gently and serve hot."
      ],
      imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nif-egusi",
      name: "Egusi Soup with Pounded Yam",
      description: "Ground melon seeds cooked in a rich palm oil broth with spinach, smoked fish, beef, and served with a side of smooth pounded yam.",
      cookTime: 50,
      calories: 680,
      protein: 38,
      carbs: 85,
      fats: 24,
      tags: ["Nigerian", "High Protein"],
      ingredients: [
        { name: "Ground Egusi (melon seeds)", qty: "200g", category: "Pantry" },
        { name: "Beef (cooked and cubed)", qty: "300g", category: "Protein" },
        { name: "Smoked fish (cleaned)", qty: "150g", category: "Protein" },
        { name: "Palm oil", qty: "100ml", category: "Pantry" },
        { name: "Fresh spinach (chopped)", qty: "2 cups", category: "Produce" },
        { name: "Beef stock", qty: "1 cup", category: "Protein" },
        { name: "Scotch bonnet pepper (blended)", qty: "1", category: "Produce" },
        { name: "Ground crayfish", qty: "1 tbsp", category: "Pantry" },
        { name: "Instant Pounded Yam flour", qty: "1 pack", category: "Pantry" }
      ],
      instructions: [
        "Mix ground Egusi with a little warm water to form a thick paste.",
        "Heat palm oil in a pot on medium heat, add chopped onion, and fry for 2 minutes.",
        "Scoop Egusi paste chunks into the hot oil and fry, stirring constantly to prevent burning, until dry crumbles form (about 10 minutes).",
        "Add beef stock, blended Scotch bonnet, cooked beef, smoked fish, and crayfish. Cover and simmer for 20 minutes.",
        "Add chopped spinach, cover, and let simmer for 5 minutes.",
        "Prepare pounded yam by stirring yam flour into boiling water until thick and smooth. Serve hot with Egusi soup."
      ],
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nif-suya",
      name: "Spicy Beef Suya",
      description: "Thinly sliced beef skewered and coated in a spicy peanut marinade (Yaji), then grilled to perfection.",
      cookTime: 35,
      calories: 310,
      protein: 34,
      carbs: 6,
      fats: 16,
      tags: ["Nigerian", "High Protein"],
      ingredients: [
        { name: "Beef flank steak (thinly sliced)", qty: "500g", category: "Protein" },
        { name: "Yaji spice blend (peanuts, ginger, chili)", qty: "1/2 cup", category: "Pantry" },
        { name: "Vegetable oil", qty: "2 tbsp", category: "Pantry" },
        { name: "Red onion (sliced)", qty: "1", category: "Produce" },
        { name: "Tomato (sliced)", qty: "1", category: "Produce" }
      ],
      instructions: [
        "Thread the thinly sliced beef onto the wooden skewers.",
        "Brush the beef skewers with vegetable oil.",
        "Generously coat the beef with the Yaji spice blend on all sides.",
        "Preheat grill or oven to 400°F (200°C). Grill skewers for 15-20 minutes, turning halfway.",
        "Serve hot garnished with sliced onions and tomatoes."
      ],
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nif-peppersoup",
      name: "Nigerian Chicken Pepper Soup",
      description: "A warming, aromatic broth prepared with tender chicken, Scotch bonnet, and traditional African spices.",
      cookTime: 30,
      calories: 240,
      protein: 28,
      carbs: 8,
      fats: 10,
      tags: ["Nigerian", "High Protein"],
      ingredients: [
        { name: "Chicken cutlets (bone-in preferred)", qty: "500g", category: "Protein" },
        { name: "Pepper soup spice mix (ehu, uziza)", qty: "2 tbsp", category: "Pantry" },
        { name: "Scotch bonnet pepper (finely chopped)", qty: "1", category: "Produce" },
        { name: "Ground crayfish", qty: "1 tbsp", category: "Pantry" },
        { name: "Medium onion (chopped)", qty: "1", category: "Produce" },
        { name: "Utazi leaves (shredded, for garnish)", qty: "2", category: "Produce" }
      ],
      instructions: [
        "Place chicken in a pot, add chopped onions, salt, and cover with water. Boil for 15 minutes.",
        "Add pepper soup spice mix, chopped Scotch bonnet pepper, and crayfish. Add more water if needed.",
        "Simmer on medium-low heat for another 15 minutes until chicken is tender and flavor is infused.",
        "Garnish with shredded Utazi leaves and serve piping hot."
      ],
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
    }
  ],

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
    const tabNifoda = document.getElementById("btn-import-tab-nifoda");
    const segmentUrl = document.getElementById("import-segment-url");
    const segmentNifoda = document.getElementById("import-segment-nifoda");
    const segmentManual = document.getElementById("import-segment-manual");

    tabScratch.addEventListener("click", () => {
      tabScratch.className = "btn btn-sm btn-primary";
      tabUrl.className = "btn btn-sm btn-secondary";
      tabNifoda.className = "btn btn-sm btn-secondary";
      segmentUrl.style.display = "none";
      segmentNifoda.style.display = "none";
      segmentManual.style.display = "flex";
    });

    tabUrl.addEventListener("click", () => {
      tabScratch.className = "btn btn-sm btn-secondary";
      tabUrl.className = "btn btn-sm btn-primary";
      tabNifoda.className = "btn btn-sm btn-secondary";
      segmentUrl.style.display = "flex";
      segmentNifoda.style.display = "none";
      segmentManual.style.display = "flex"; // Keep manual open for autofill review!
    });

    tabNifoda.addEventListener("click", () => {
      tabScratch.className = "btn btn-sm btn-secondary";
      tabUrl.className = "btn btn-sm btn-secondary";
      tabNifoda.className = "btn btn-sm btn-primary";
      segmentUrl.style.display = "none";
      segmentNifoda.style.display = "flex";
      segmentManual.style.display = "flex"; // Keep manual open for autofill review!
    });

    // NIFODA Load trigger
    const btnNifodaLoad = document.getElementById("btn-trigger-nifoda-load");
    btnNifodaLoad.addEventListener("click", () => {
      const selectVal = document.getElementById("import-nifoda-select").value;
      if (!selectVal) {
        alert("Please select a Nigerian recipe to load!");
        return;
      }
      this.loadNifodaImporterRecipe(selectVal);
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
    
    // Choose data source based on whether we are viewing NIFODA database or personal library
    const isNifodaView = this.currentFilter === "NIFODA";
    const recipes = isNifodaView ? this.nifodaRecipes : State.data.recipes;

    // Filter recipes
    const filteredRecipes = recipes.filter(recipe => {
      // 1. Search Query filter
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery) ||
                            recipe.description.toLowerCase().includes(searchQuery) ||
                            recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery));

      if (!matchesSearch) return false;

      // 2. Category tab filter
      if (isNifodaView) return true; // Show all matching NIFODA items
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
      
      // Check if this recipe is already imported (by name matching)
      const isImported = State.data.recipes.some(r => r.name.toLowerCase() === recipe.name.toLowerCase());
      
      // Favorite button is hidden on NIFODA view templates
      let favButtonHtml = "";
      if (!isNifodaView) {
        favButtonHtml = `
          <button class="recipe-card-fav ${recipe.favorite ? 'active' : ''}" data-id="${recipe.id}" title="${recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}">
            <i class="${recipe.favorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        `;
      }
      
      // Tags rendering
      let tagsHtml = "";
      recipe.tags.slice(0, 2).forEach(t => {
        // Special accent color badge for Nigerian tag
        const isNigerianTag = t === "Nigerian";
        tagsHtml += `<span class="badge ${isNigerianTag ? 'badge-nigerian' : 'badge-primary'}">${t}</span>`;
      });

      let actionsHtml = "";
      if (isNifodaView) {
        if (isImported) {
          actionsHtml = `
            <button class="btn btn-secondary btn-sm btn-details" data-id="${recipe.id}"><i class="fa-solid fa-circle-info"></i> Details</button>
            <button class="btn btn-secondary btn-sm" disabled style="cursor: not-allowed; opacity: 0.7;"><i class="fa-solid fa-check"></i> Imported</button>
          `;
        } else {
          actionsHtml = `
            <button class="btn btn-secondary btn-sm btn-details" data-id="${recipe.id}"><i class="fa-solid fa-circle-info"></i> Details</button>
            <button class="btn btn-primary btn-sm btn-import-nifoda" data-id="${recipe.id}"><i class="fa-solid fa-download"></i> Import</button>
          `;
        }
      } else {
        actionsHtml = `
          <button class="btn btn-secondary btn-sm btn-details" data-id="${recipe.id}"><i class="fa-solid fa-circle-info"></i> Details</button>
          <button class="btn btn-primary btn-sm btn-schedule" data-id="${recipe.id}"><i class="fa-solid fa-plus"></i> Schedule</button>
        `;
      }

      card.innerHTML = `
        <div class="recipe-card-image" style="background-image: url('${recipe.imageUrl}');">
          ${favButtonHtml}
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
          ${actionsHtml}
        </div>
      `;

      // Bind Favorite toggle
      if (!isNifodaView) {
        card.querySelector(".recipe-card-fav").addEventListener("click", (e) => {
          e.stopPropagation();
          State.toggleFavorite(recipe.id);
          this.render();
        });
      }

      // Bind details popup
      card.querySelector(".btn-details").addEventListener("click", () => {
        this.showDetails(recipe.id, isNifodaView);
      });

      // Bind direct schedule / import
      if (isNifodaView) {
        if (!isImported) {
          card.querySelector(".btn-import-nifoda").addEventListener("click", () => {
            this.importNifodaRecipe(recipe.id);
          });
        }
      } else {
        card.querySelector(".btn-schedule").addEventListener("click", () => {
          this.scheduleRecipe(recipe);
        });
      }

      container.appendChild(card);
    });
  },

  showDetails(id, isNifodaView = false) {
    const sourceList = isNifodaView ? this.nifodaRecipes : State.data.recipes;
    const recipe = sourceList.find(r => r.id === id);
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
    if (isNifodaView) {
      favContainer.innerHTML = "";
    } else {
      favContainer.innerHTML = `
        <button class="recipe-card-fav ${recipe.favorite ? 'active' : ''}" style="width: 38px; height: 38px; font-size: 16px;">
          <i class="${recipe.favorite ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      `;
      favContainer.querySelector("button").addEventListener("click", () => {
        State.toggleFavorite(recipe.id);
        this.showDetails(recipe.id, false);
        this.render(); // Update grid behind modal
      });
    }

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

    // Details modal footer schedule/import button
    const footerBtn = document.getElementById("btn-details-schedule");
    if (isNifodaView) {
      const isImported = State.data.recipes.some(r => r.name.toLowerCase() === recipe.name.toLowerCase());
      if (isImported) {
        footerBtn.innerText = "Imported";
        footerBtn.disabled = true;
        footerBtn.className = "btn btn-secondary";
      } else {
        footerBtn.innerHTML = `<i class="fa-solid fa-download"></i> Import to Library`;
        footerBtn.disabled = false;
        footerBtn.className = "btn btn-primary";
        // Re-bind click handler for import inside modal details
        const newFooterBtn = footerBtn.cloneNode(true);
        footerBtn.parentNode.replaceChild(newFooterBtn, footerBtn);
        newFooterBtn.addEventListener("click", () => {
          this.importNifodaRecipe(recipe.id);
          closeModal("modal-recipe-details");
        });
      }
    } else {
      footerBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Schedule to Plan`;
      footerBtn.disabled = false;
      footerBtn.className = "btn btn-primary";
      // Re-bind schedule action
      const newFooterBtn = footerBtn.cloneNode(true);
      footerBtn.parentNode.replaceChild(newFooterBtn, footerBtn);
      newFooterBtn.addEventListener("click", () => {
        this.scheduleRecipe(recipe);
        closeModal("modal-recipe-details");
      });
    }

    openModal("modal-recipe-details");
  },

  async importNifodaRecipe(id) {
    const recipe = this.nifodaRecipes.find(r => r.id === id);
    if (!recipe) return;

    // Check if already imported
    const exists = State.data.recipes.some(r => r.name.toLowerCase() === recipe.name.toLowerCase());
    if (exists) {
      alert("This recipe is already imported to your library!");
      return;
    }

    // Add to State
    await State.addRecipe({
      name: recipe.name,
      description: recipe.description,
      cookTime: recipe.cookTime,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fats: recipe.fats,
      tags: recipe.tags,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl
    });

    alert(`Successfully imported "${recipe.name}" to your library!`);
    
    // Switch filter to "All" and render
    const tabs = document.querySelectorAll("#recipe-filter-tabs .filter-tab");
    tabs.forEach(t => {
      if (t.getAttribute("data-filter") === "All") {
        t.click();
      }
    });
  },

  loadNifodaImporterRecipe(key) {
    const matched = this.nifodaRecipes.find(r => r.id === `nif-${key}`);
    if (matched) {
      document.getElementById("import-name").value = matched.name;
      document.getElementById("import-desc").value = matched.description;
      document.getElementById("import-time").value = matched.cookTime;
      document.getElementById("import-cal").value = matched.calories;
      document.getElementById("import-prot").value = matched.protein;
      document.getElementById("import-carb").value = matched.carbs;
      document.getElementById("import-fat").value = matched.fats;
      document.getElementById("import-primary-tag").value = "Nigerian";
      
      const ingredientsText = matched.ingredients.map(i => `${i.qty} ${i.name}`).join("\n");
      document.getElementById("import-ingredients").value = ingredientsText;
      
      const instructionsText = matched.instructions.join("\n");
      document.getElementById("import-instructions").value = instructionsText;
      
      alert(`Loaded "${matched.name}" details from NIFODA! You can now review and customize below before creating the recipe.`);
    }
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
    const urlVal = document.getElementById("import-recipe-url").value.toLowerCase().trim();
    
    scraperBtn.disabled = true;
    scraperBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i>Scraping website markup...`;

    setTimeout(() => {
      let dish = null;
      if (urlVal.includes("nifoda") || urlVal.includes("samdoghor") || urlVal.includes("nigeria")) {
        // Find which recipe matches
        if (urlVal.includes("jollof")) {
          dish = this.nifodaRecipes.find(r => r.id === "nif-jollof");
        } else if (urlVal.includes("egusi")) {
          dish = this.nifodaRecipes.find(r => r.id === "nif-egusi");
        } else if (urlVal.includes("suya")) {
          dish = this.nifodaRecipes.find(r => r.id === "nif-suya");
        } else if (urlVal.includes("pepper")) {
          dish = this.nifodaRecipes.find(r => r.id === "nif-peppersoup");
        } else {
          // Default to a random NIFODA dish
          const randomIndex = Math.floor(Math.random() * this.nifodaRecipes.length);
          dish = this.nifodaRecipes[randomIndex];
        }
      }

      if (dish) {
        document.getElementById("import-name").value = dish.name;
        document.getElementById("import-desc").value = dish.description;
        document.getElementById("import-time").value = dish.cookTime;
        document.getElementById("import-cal").value = dish.calories;
        document.getElementById("import-prot").value = dish.protein;
        document.getElementById("import-carb").value = dish.carbs;
        document.getElementById("import-fat").value = dish.fats;
        document.getElementById("import-primary-tag").value = "Nigerian";
        
        const ingredientsText = dish.ingredients.map(i => `${i.qty} ${i.name}`).join("\n");
        document.getElementById("import-ingredients").value = ingredientsText;
        
        const instructionsText = dish.instructions.join("\n");
        document.getElementById("import-instructions").value = instructionsText;
        
        alert(`Detected NIFODA database source! Autofilled "${dish.name}" from repository metadata!`);
      } else {
        // Standard non-Nigerian fallback
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
          
        alert("Autofilled recipe from web scraper parsing!");
      }

      scraperBtn.disabled = false;
      scraperBtn.innerHTML = originalText;
    }, 1500);
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
