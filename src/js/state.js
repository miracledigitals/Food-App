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
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.data = JSON.parse(saved);
        // Guarantee settings exist
        if (!this.data.settings) {
          this.data.settings = { calories: 2000, protein: 130, carbs: 220, fats: 65 };
        }
      } else {
        this.resetToDefault();
      }
    } catch (e) {
      console.warn("Error loading state from localStorage, using in-memory state:", e);
      this.resetToDefault();
    }
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Error saving state to localStorage:", e);
    }
    // Trigger custom event so modules know data changed
    window.dispatchEvent(new CustomEvent("stateUpdated"));
  },

  resetToDefault() {
    this.data = {
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
    };
    this.save();
  },

  // Supabase Cloud Synchronizer
  async syncWithSupabase() {
    if (!window.SupabaseService || !SupabaseService.isLoggedIn()) return;

    try {
      console.log("Syncing database with Supabase cloud tables...");

      // 1. Profile / Targets Sync & Database Initialization Check
      let profile = await SupabaseService.getProfile();
      if (!profile) {
        console.log("No cloud profile found. Initializing database for new user...");
        const fullName = SupabaseService.currentUser.user_metadata?.full_name || "";
        await SupabaseService.initializeUserDatabase(SupabaseService.currentUser.id, fullName);
        profile = await SupabaseService.getProfile();
      }

      if (profile) {
        this.data.settings = {
          calories: profile.calorie_target,
          protein: profile.protein_target,
          carbs: profile.carbs_target,
          fats: profile.fats_target
        };
      }

      // 2. Recipes Sync
      this.data.recipes = await SupabaseService.fetchRecipes();

      // 3. Weekly Planner Sync
      const cloudPlanner = await SupabaseService.fetchPlanner();
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
window.State = State;
