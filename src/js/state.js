const DEFAULT_RECIPES = [
  {
    id: "rec-avocado-toast",
    name: "Smashed Avocado & Egg Toast",
    description: "Creamy smashed avocado on toasted sourdough, topped with a soft-poached egg, chili flakes, and microgreens.",
    calories: 380,
    protein: 16,
    carbs: 32,
    fats: 22,
    cookTime: 12,
    tags: ["Under 30 Mins", "Breakfast", "High Protein"],
    ingredients: [
      { name: "Sourdough Bread", qty: "1 slice", category: "Pantry" },
      { name: "Avocado", qty: "1/2 medium", category: "Produce" },
      { name: "Egg", qty: "1 large", category: "Protein" },
      { name: "Chili Flakes", qty: "1 pinch", category: "Pantry" },
      { name: "Microgreens", qty: "1 tablespoon", category: "Produce" }
    ],
    instructions: [
      "Toast the sourdough bread to your liking.",
      "In a small bowl, smash the avocado with a pinch of salt and lemon juice.",
      "Poach or fry the egg in a pan.",
      "Spread smashed avocado on toast, top with the egg, chili flakes, and microgreens."
    ],
    imageUrl: "./assets/avocado_toast.png",
    favorite: true
  },
  {
    id: "rec-salmon",
    name: "Lemon Herb Grilled Salmon",
    description: "Crispy skin-on salmon fillet grilled with fresh dill, lemon zest, served with asparagus spears.",
    calories: 450,
    protein: 38,
    carbs: 8,
    fats: 28,
    cookTime: 20,
    tags: ["Under 30 Mins", "Meal Prep", "High Protein"],
    ingredients: [
      { name: "Salmon Fillet", qty: "150g", category: "Protein" },
      { name: "Asparagus", qty: "100g", category: "Produce" },
      { name: "Lemon", qty: "1/2 piece", category: "Produce" },
      { name: "Fresh Dill", qty: "1 sprig", category: "Produce" },
      { name: "Olive Oil", qty: "1 tbsp", category: "Pantry" }
    ],
    instructions: [
      "Preheat grill or pan to medium-high heat.",
      "Rub salmon with olive oil, salt, pepper, and lemon zest.",
      "Grill salmon skin-side down for 5-6 mins, then flip and cook for 3-4 mins.",
      "Toss asparagus in olive oil and grill alongside salmon for 5 mins.",
      "Serve hot garnished with fresh dill and lemon slices."
    ],
    imageUrl: "./assets/grilled_salmon.png",
    favorite: true
  },
  {
    id: "rec-quinoa-salad",
    name: "Mediterranean Quinoa Salad",
    description: "A refreshing blend of fluffy quinoa, crisp cucumbers, cherry tomatoes, Kalamata olives, and crumbled feta cheese.",
    calories: 320,
    protein: 10,
    carbs: 42,
    fats: 14,
    cookTime: 15,
    tags: ["Under 30 Mins", "Meal Prep", "Vegan"],
    ingredients: [
      { name: "Quinoa (Cooked)", qty: "1 cup", category: "Pantry" },
      { name: "Cucumber", qty: "1/2 cup diced", category: "Produce" },
      { name: "Cherry Tomatoes", qty: "1/2 cup halved", category: "Produce" },
      { name: "Kalamata Olives", qty: "6 pieces", category: "Pantry" },
      { name: "Feta Cheese", qty: "30g", category: "Dairy" }
    ],
    instructions: [
      "Cook quinoa according to package instructions and let cool.",
      "Chop cucumber, cherry tomatoes, and olives.",
      "In a large bowl, combine quinoa, vegetables, olives, and crumbled feta.",
      "Drizzle with lemon juice and a touch of olive oil, toss well."
    ],
    imageUrl: "./assets/quinoa_salad.png",
    favorite: false
  },
  {
    id: "rec-smoothie",
    name: "Vibrant Berry Power Smoothie",
    description: "A thick, antioxidant-rich smoothie packed with mixed berries, vanilla whey protein, spinach, and almond milk.",
    calories: 290,
    protein: 26,
    carbs: 34,
    fats: 5,
    cookTime: 5,
    tags: ["Under 30 Mins", "Breakfast", "High Protein"],
    ingredients: [
      { name: "Mixed Berries (Frozen)", qty: "1 cup", category: "Produce" },
      { name: "Spinach", qty: "1 handful", category: "Produce" },
      { name: "Vanilla Whey Protein", qty: "1 scoop", category: "Protein" },
      { name: "Almond Milk (Unsweetened)", qty: "1 cup", category: "Dairy" }
    ],
    instructions: [
      "Add all ingredients to a high-speed blender.",
      "Blend on high for 60 seconds or until completely smooth.",
      "Pour into a glass and enjoy immediately."
    ],
    imageUrl: "./assets/berry_smoothie.png",
    favorite: false
  },
  {
    id: "rec-buddha-bowl",
    name: "Sesame Tofu Buddha Bowl",
    description: "Pan-seared sesame tofu blocks served over a bed of brown rice, steamed broccoli, edamame, and a drizzle of spicy peanut dressing.",
    calories: 520,
    protein: 22,
    carbs: 65,
    fats: 18,
    cookTime: 25,
    tags: ["Meal Prep", "Vegan"],
    ingredients: [
      { name: "Firm Tofu", qty: "100g", category: "Protein" },
      { name: "Brown Rice (Cooked)", qty: "1 cup", category: "Pantry" },
      { name: "Broccoli", qty: "1/2 cup florets", category: "Produce" },
      { name: "Edamame (Shelled)", qty: "1/4 cup", category: "Produce" },
      { name: "Peanut Butter", qty: "1 tbsp", category: "Pantry" }
    ],
    instructions: [
      "Press tofu to remove excess moisture, cut into cubes, and coat in sesame seeds.",
      "Pan-sear tofu in sesame oil until crispy on all sides.",
      "Steam broccoli florets until tender-crisp.",
      "Assemble the bowl with brown rice, tofu, broccoli, and edamame.",
      "Whisk peanut butter with soy sauce, hot water, and lime juice, then drizzle over the bowl."
    ],
    imageUrl: "./assets/vegan_buddha_bowl.png",
    favorite: true
  },
  {
    id: "rec-pancakes",
    name: "Fluffy Protein Oat Pancakes",
    description: "Delicious blender pancakes made with rolled oats, banana, cottage cheese, and eggs. Naturally gluten-free and high protein.",
    calories: 420,
    protein: 28,
    carbs: 48,
    fats: 12,
    cookTime: 15,
    tags: ["Under 30 Mins", "Breakfast", "Cheat Day"],
    ingredients: [
      { name: "Rolled Oats", qty: "1/2 cup", category: "Pantry" },
      { name: "Banana", qty: "1/2 medium", category: "Produce" },
      { name: "Cottage Cheese", qty: "1/4 cup", category: "Dairy" },
      { name: "Eggs", qty: "2 large", category: "Protein" }
    ],
    instructions: [
      "Add oats, banana, cottage cheese, and eggs to a blender. Blend until smooth.",
      "Heat a non-stick skillet over medium-high heat and grease lightly.",
      "Pour batter onto the skillet to form pancakes. Cook until bubbles form, then flip.",
      "Cook other side until golden brown. Serve with fresh fruit and a drizzle of maple syrup."
    ],
    imageUrl: "./assets/protein_pancakes.png",
    favorite: false
  }
];

const DEFAULT_PLANNER = {
  monday: {
    breakfast: { id: "rec-avocado-toast", name: "Smashed Avocado & Egg Toast", calories: 380, protein: 16, carbs: 32, fats: 22 },
    lunch: null,
    dinner: { id: "rec-salmon", name: "Lemon Herb Grilled Salmon", calories: 450, protein: 38, carbs: 8, fats: 28 },
    snack: null
  },
  tuesday: {
    breakfast: { id: "rec-smoothie", name: "Vibrant Berry Power Smoothie", calories: 290, protein: 26, carbs: 34, fats: 5 },
    lunch: { id: "rec-quinoa-salad", name: "Mediterranean Quinoa Salad", calories: 320, protein: 10, carbs: 42, fats: 14 },
    dinner: null,
    snack: null
  },
  wednesday: {
    breakfast: null,
    lunch: { id: "rec-quinoa-salad", name: "Mediterranean Quinoa Salad", calories: 320, protein: 10, carbs: 42, fats: 14 },
    dinner: { id: "rec-buddha-bowl", name: "Sesame Tofu Buddha Bowl", calories: 520, protein: 22, carbs: 65, fats: 18 },
    snack: null
  },
  thursday: {
    breakfast: { id: "rec-avocado-toast", name: "Smashed Avocado & Egg Toast", calories: 380, protein: 16, carbs: 32, fats: 22 },
    lunch: null,
    dinner: null,
    snack: null
  },
  friday: {
    breakfast: null,
    lunch: null,
    dinner: { id: "rec-salmon", name: "Lemon Herb Grilled Salmon", calories: 450, protein: 38, carbs: 8, fats: 28 },
    snack: null
  },
  saturday: {
    breakfast: { id: "rec-pancakes", name: "Fluffy Protein Oat Pancakes", calories: 420, protein: 28, carbs: 48, fats: 12 },
    lunch: null,
    dinner: null,
    snack: { id: "rec-smoothie", name: "Vibrant Berry Power Smoothie", calories: 290, protein: 26, carbs: 34, fats: 5 }
  },
  sunday: {
    breakfast: null,
    lunch: { id: "rec-buddha-bowl", name: "Sesame Tofu Buddha Bowl", calories: 520, protein: 22, carbs: 65, fats: 18 },
    dinner: null,
    snack: null
  }
};

const DEFAULT_LOGS = [
  {
    id: "log-1",
    name: "Avocado Toast + 2 Boiled Eggs",
    calories: 520,
    protein: 28,
    carbs: 35,
    fats: 30,
    tags: ["High Protein"],
    timestamp: "2026-06-17T08:30:00",
    mealType: "breakfast"
  },
  {
    id: "log-2",
    name: "Greek Yogurt with Blueberries",
    calories: 220,
    protein: 18,
    carbs: 20,
    fats: 6,
    tags: ["Under 30 Mins"],
    timestamp: "2026-06-17T11:00:00",
    mealType: "snack"
  }
];

const DEFAULT_REMINDERS = [
  { id: "rem-1", text: "Sunday meal prep: Grill chicken and salmon for workdays", completed: false },
  { id: "rem-2", text: "Buy fresh herbs (dill, parsley, mint) for salads", completed: true },
  { id: "rem-3", text: "Portion out raw almonds and mixed berries for snacks", completed: false }
];

const STORAGE_KEY = "sous_chef_pro_state";

const State = {
  data: {
    recipes: [],
    weeklyPlanner: {},
    loggedMeals: [],
    settings: {
      calories: 2000,
      protein: 130,
      carbs: 220,
      fats: 65
    },
    reminders: []
  },

  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        // Guarantee settings exist
        if (!this.data.settings) {
          this.data.settings = { calories: 2000, protein: 130, carbs: 220, fats: 65 };
        }
      } catch (e) {
        console.error("Error loading state from localStorage, resetting", e);
        this.resetToDefault();
      }
    } else {
      this.resetToDefault();
    }
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    // Trigger custom event so modules know data changed
    window.dispatchEvent(new CustomEvent("stateUpdated"));
  },

  resetToDefault() {
    this.data = {
      recipes: [...DEFAULT_RECIPES],
      weeklyPlanner: JSON.parse(JSON.stringify(DEFAULT_PLANNER)),
      loggedMeals: [...DEFAULT_LOGS],
      settings: {
        calories: 2000,
        protein: 130,
        carbs: 220,
        fats: 65
      },
      reminders: [...DEFAULT_REMINDERS]
    };
    this.save();
  },

  // Supabase Cloud Synchronizer
  async syncWithSupabase() {
    if (!window.SupabaseService || !SupabaseService.isLoggedIn()) return;

    try {
      console.log("Syncing database with Supabase cloud tables...");

      // 1. Recipes Sync
      let cloudRecipes = await SupabaseService.fetchRecipes();
      if (cloudRecipes.length === 0) {
        // New user has no recipes: prepopulate cloud with defaults
        for (let recipe of DEFAULT_RECIPES) {
          await SupabaseService.saveRecipe(recipe);
        }
        cloudRecipes = await SupabaseService.fetchRecipes();
      }
      this.data.recipes = cloudRecipes;

      // 2. Profile / Targets Sync
      const profile = await SupabaseService.getProfile();
      if (profile) {
        this.data.settings = {
          calories: profile.calorie_target,
          protein: profile.protein_target,
          carbs: profile.carbs_target,
          fats: profile.fats_target
        };
      }

      // 3. Weekly Planner Sync
      const cloudPlanner = await SupabaseService.fetchPlanner();
      // Resolve recipe relations on client side
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
      
      this.data.weeklyPlanner = {};
      days.forEach(day => {
        this.data.weeklyPlanner[day] = { breakfast: null, lunch: null, dinner: null, snack: null };
        mealTypes.forEach(type => {
          if (cloudPlanner[day] && cloudPlanner[day][type]) {
            const meal = cloudPlanner[day][type];
            if (meal.recipe_id) {
              const matched = this.data.recipes.find(r => r.id === meal.recipe_id);
              if (matched) {
                this.data.weeklyPlanner[day][type] = {
                  id: matched.id,
                  name: matched.name,
                  calories: matched.calories,
                  protein: matched.protein,
                  carbs: matched.carbs,
                  fats: matched.fats
                };
              }
            } else {
              this.data.weeklyPlanner[day][type] = meal;
            }
          }
        });
      });

      // 4. Logged History Sync
      this.data.loggedMeals = await SupabaseService.fetchLogs();

      // 5. Reminders Sync
      this.data.reminders = await SupabaseService.fetchReminders();

      // Update Local cache
      this.save();
    } catch (err) {
      console.error("Failed syncing with Supabase: ", err);
    }
  },

  // Planner Methods
  async addMealToPlan(day, type, mealData) {
    if (!this.data.weeklyPlanner[day]) {
      this.data.weeklyPlanner[day] = { breakfast: null, lunch: null, dinner: null, snack: null };
    }
    
    const formattedMeal = {
      id: mealData.id || `custom-${Date.now()}`,
      name: mealData.name,
      calories: Number(mealData.calories) || 0,
      protein: Number(mealData.protein) || 0,
      carbs: Number(mealData.carbs) || 0,
      fats: Number(mealData.fats) || 0
    };

    this.data.weeklyPlanner[day][type] = formattedMeal;

    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      await SupabaseService.savePlannerSlot(day, type, formattedMeal);
    }

    this.save();
  },

  async removeMealFromPlan(day, type) {
    if (this.data.weeklyPlanner[day]) {
      this.data.weeklyPlanner[day][type] = null;
      
      if (window.SupabaseService && SupabaseService.isLoggedIn()) {
        await SupabaseService.deletePlannerSlot(day, type);
      }

      this.save();
    }
  },

  // Logger Methods
  async logMeal(mealLog) {
    const newLog = {
      name: mealLog.name,
      calories: Number(mealLog.calories) || 0,
      protein: Number(mealLog.protein) || 0,
      carbs: Number(mealLog.carbs) || 0,
      fats: Number(mealLog.fats) || 0,
      tags: mealLog.tags || [],
      timestamp: mealLog.timestamp || new Date().toISOString(),
      mealType: mealLog.mealType || "lunch"
    };

    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      const savedRow = await SupabaseService.saveLog(newLog);
      if (savedRow) newLog.id = savedRow.id;
    } else {
      newLog.id = `log-${Date.now()}`;
    }

    this.data.loggedMeals.push(newLog);
    this.save();
  },

  async deleteLoggedMeal(id) {
    this.data.loggedMeals = this.data.loggedMeals.filter(l => l.id !== id);
    
    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      await SupabaseService.deleteLog(id);
    }

    this.save();
  },

  // Recipe Methods
  async addRecipe(recipe) {
    const newRecipe = {
      name: recipe.name,
      description: recipe.description || "",
      calories: Number(recipe.calories) || 0,
      protein: Number(recipe.protein) || 0,
      carbs: Number(recipe.carbs) || 0,
      fats: Number(recipe.fats) || 0,
      cookTime: Number(recipe.cookTime) || 15,
      tags: recipe.tags || [],
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      imageUrl: recipe.imageUrl || "./assets/placeholder_food.jpg"
    };

    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      const savedRow = await SupabaseService.saveRecipe(newRecipe);
      if (savedRow) newRecipe.id = savedRow.id;
    } else {
      newRecipe.id = `rec-${Date.now()}`;
    }

    this.data.recipes.push(newRecipe);
    this.save();
    return newRecipe;
  },

  async toggleFavorite(recipeId) {
    const recipe = this.data.recipes.find(r => r.id === recipeId);
    if (recipe) {
      recipe.favorite = !recipe.favorite;
      
      if (window.SupabaseService && SupabaseService.isLoggedIn()) {
        await SupabaseService.toggleFavoriteRecipe(recipeId, recipe.favorite);
      }

      this.save();
    }
  },

  // Reminder/Notes Methods
  async addReminder(text) {
    const reminder = {
      text: text,
      completed: false
    };

    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      const savedRow = await SupabaseService.saveReminder(text);
      if (savedRow) {
        reminder.id = savedRow.id;
      }
    } else {
      reminder.id = `rem-${Date.now()}`;
    }

    this.data.reminders.push(reminder);
    this.save();
    return reminder;
  },

  async toggleReminder(id) {
    const reminder = this.data.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.completed = !reminder.completed;
      
      if (window.SupabaseService && SupabaseService.isLoggedIn()) {
        await SupabaseService.toggleReminder(id, reminder.completed);
      }

      this.save();
    }
  },

  async deleteReminder(id) {
    this.data.reminders = this.data.reminders.filter(r => r.id !== id);
    
    if (window.SupabaseService && SupabaseService.isLoggedIn()) {
      await SupabaseService.deleteReminder(id);
    }

    this.save();
  },

  // Settings
  updateSettings(settings) {
    this.data.settings = {
      calories: Number(settings.calories) || 2000,
      protein: Number(settings.protein) || 130,
      carbs: Number(settings.carbs) || 220,
      fats: Number(settings.fats) || 65
    };
    this.save();
  }
};

// Initialize State immediately
State.init();
window.State = State; // Expose to other scripts
