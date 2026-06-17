const GroceryModule = {
  checkedItems: new Set(), // Store checked ingredient names

  init() {
    // Refresh button click
    const refreshBtn = document.getElementById("btn-grocery-refresh");
    refreshBtn.addEventListener("click", () => {
      this.checkedItems.clear();
      this.render();
      alert("Grocery list recalculated from current weekly meal plan!");
    });

    // Clear Checked button
    const clearCheckedBtn = document.getElementById("btn-grocery-clear-checked");
    clearCheckedBtn.addEventListener("click", () => {
      if (this.checkedItems.size === 0) {
        alert("No checked items to clear.");
        return;
      }
      if (confirm(`Remove the ${this.checkedItems.size} checked items from the current list?`)) {
        // We will just filter them out during render
        this.render(true);
      }
    });

    // Print button
    const printBtn = document.getElementById("btn-grocery-print");
    printBtn.addEventListener("click", () => {
      window.print();
    });
  },

  render(filterChecked = false) {
    const listWrapper = document.getElementById("grocery-list-wrapper");
    const emptyState = document.getElementById("grocery-empty-state");

    // 1. Gather all recipes in the planner
    const planner = State.data.weeklyPlanner;
    const scheduledRecipes = [];

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

    days.forEach(day => {
      const planDay = planner[day] || {};
      mealTypes.forEach(type => {
        const meal = planDay[type];
        if (meal && meal.id && !meal.id.startsWith("custom-")) {
          const recipe = State.data.recipes.find(r => r.id === meal.id);
          if (recipe) {
            scheduledRecipes.push(recipe);
          }
        }
      });
    });

    if (scheduledRecipes.length === 0) {
      listWrapper.style.display = "none";
      emptyState.style.display = "flex";
      return;
    }

    listWrapper.style.display = "block";
    emptyState.style.display = "none";

    // 2. Consolidate ingredients
    const ingredientMap = {};

    scheduledRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name.trim().toLowerCase();
        
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            name: ing.name.trim(),
            category: ing.category || "Pantry",
            quantities: [ing.qty]
          };
        } else {
          ingredientMap[key].quantities.push(ing.qty);
        }
      });
    });

    // Smart quantity unit sum resolver
    const consolidatedList = Object.values(ingredientMap).map(item => {
      const qtyText = this.sumQuantities(item.quantities);
      return {
        name: item.name,
        category: item.category,
        qty: qtyText
      };
    });

    // Filter checked if requested
    let finalItems = consolidatedList;
    if (filterChecked) {
      finalItems = consolidatedList.filter(item => !this.checkedItems.has(item.name.toLowerCase()));
      // Reset checklist state for cleared items
      this.checkedItems.clear();
    }

    // 3. Group by Category
    const categories = ["Produce", "Protein", "Dairy", "Pantry"];
    const grouped = { Produce: [], Protein: [], Dairy: [], Pantry: [] };

    finalItems.forEach(item => {
      const cat = grouped[item.category] ? item.category : "Pantry";
      grouped[cat].push(item);
    });

    // 4. Render Group layouts
    listWrapper.innerHTML = "";

    categories.forEach(cat => {
      const items = grouped[cat];
      if (!items || items.length === 0) return;

      const groupDiv = document.createElement("div");
      groupDiv.className = "grocery-category-group";
      groupDiv.innerHTML = `<h3 class="grocery-category-title">${cat}</h3>`;

      const gridDiv = document.createElement("div");
      gridDiv.className = "grocery-items-grid";

      items.forEach(item => {
        const itemKey = item.name.toLowerCase();
        const isChecked = this.checkedItems.has(itemKey);

        const row = document.createElement("div");
        row.className = `grocery-item-row ${isChecked ? 'checked' : ''}`;
        row.innerHTML = `
          <div class="grocery-item-left">
            <input type="checkbox" class="grocery-checkbox" ${isChecked ? 'checked' : ''}>
            <span class="grocery-item-name">${item.name}</span>
          </div>
          <span class="grocery-item-qty">${item.qty}</span>
        `;

        // Bind checkbox change
        row.querySelector(".grocery-checkbox").addEventListener("change", (e) => {
          if (e.target.checked) {
            this.checkedItems.add(itemKey);
            row.classList.add("checked");
          } else {
            this.checkedItems.delete(itemKey);
            row.classList.remove("checked");
          }
        });

        gridDiv.appendChild(row);
      });

      groupDiv.appendChild(gridDiv);
      listWrapper.appendChild(groupDiv);
    });
  },

  sumQuantities(qtyArray) {
    if (qtyArray.length === 1) return qtyArray[0];

    let numericSum = 0;
    let commonUnit = null;
    let parseFailed = false;

    for (let i = 0; i < qtyArray.length; i++) {
      const qtyStr = qtyArray[i];
      if (!qtyStr) continue;

      // Extract number and unit
      // E.g. "150g" -> 150, "g"; "2 tbsp" -> 2, "tbsp"; "1/2 cup" -> 0.5, "cup"
      const match = qtyStr.trim().match(/^([\d\/\.]+)\s*(.*)$/);
      if (match) {
        let val = parseFloat(match[1]);
        if (match[1].includes("/")) {
          const parts = match[1].split("/");
          val = parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        const unit = match[2].trim().toLowerCase();

        if (i === 0) {
          commonUnit = unit;
          numericSum = val;
        } else {
          if (unit === commonUnit) {
            numericSum += val;
          } else {
            parseFailed = true;
            break;
          }
        }
      } else {
        parseFailed = true;
        break;
      }
    }

    if (!parseFailed && commonUnit !== null) {
      // Clean decimals (e.g. 1.5 instead of 1.5000000000000002)
      const formattedSum = Math.round(numericSum * 100) / 100;
      return `${formattedSum} ${commonUnit || ""}`.trim();
    }

    // Fallback: join raw strings
    return qtyArray.join(" + ");
  }
};

// Bind to window load
document.addEventListener("DOMContentLoaded", () => {
  GroceryModule.init();
  window.GroceryModule = GroceryModule;
});
