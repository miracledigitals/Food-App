const SupabaseService = {
  client: null,
  currentUser: null,

  init() {
    if (Config.isConfigured() && window.supabase) {
      try {
        this.client = window.supabase.createClient(Config.SUPABASE_URL, Config.SUPABASE_KEY);
        this.setupAuthListener();
      } catch (e) {
        console.error("Error creating Supabase client: ", e);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  },

  setupAuthListener() {
    if (!this.client) return;

    this.client.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        this.currentUser = session.user;
        // Load cloud state
        await State.syncWithSupabase();
      } else {
        this.currentUser = null;
        // User logged out, clear cloud state, revert to local
        State.init(); // Reset back to local mock data
      }
      window.dispatchEvent(new CustomEvent("supabaseAuthChanged"));
    });

    // Check initial session
    this.client.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        this.currentUser = session.user;
        State.syncWithSupabase();
      }
    });
  },

  async signUp(email, password, fullName) {
    if (!this.client) throw new Error("Supabase is not configured.");
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    if (!this.client) throw new Error("Supabase is not configured.");
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!this.client) return;
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  },

  isLoggedIn() {
    return this.client !== null && this.currentUser !== null;
  },

  // 1. Profile Queries
  async getProfile() {
    if (!this.isLoggedIn()) return null;
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", this.currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile: ", error);
      return null;
    }
    return data;
  },

  async updateProfile(profileData) {
    if (!this.isLoggedIn()) return false;
    const { error } = await this.client
      .from("profiles")
      .update({
        full_name: profileData.fullName,
        role: profileData.role,
        calorie_target: Number(profileData.calorieTarget),
        protein_target: Number(profileData.proteinTarget),
        carbs_target: Number(profileData.carbsTarget),
        fats_target: Number(profileData.fatsTarget),
        updated_at: new Date()
      })
      .eq("id", this.currentUser.id);

    if (error) {
      console.error("Error updating profile: ", error);
      throw error;
    }
    return true;
  },

  // 2. Recipes Queries
  async fetchRecipes() {
    if (!this.isLoggedIn()) return [];
    const { data, error } = await this.client
      .from("recipes")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching recipes: ", error);
      return [];
    }
    return data.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fats: r.fats,
      cookTime: r.cook_time,
      tags: r.tags,
      ingredients: r.ingredients,
      instructions: r.instructions,
      imageUrl: r.image_url,
      favorite: r.favorite
    }));
  },

  async saveRecipe(recipe) {
    if (!this.isLoggedIn()) return null;
    const recipeRow = {
      user_id: this.currentUser.id,
      name: recipe.name,
      description: recipe.description || "",
      calories: Number(recipe.calories) || 0,
      protein: Number(recipe.protein) || 0,
      carbs: Number(recipe.carbs) || 0,
      fats: Number(recipe.fats) || 0,
      cook_time: Number(recipe.cookTime) || 15,
      tags: recipe.tags || [],
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      image_url: recipe.imageUrl,
      favorite: false
    };

    const { data, error } = await this.client
      .from("recipes")
      .insert([recipeRow])
      .select()
      .single();

    if (error) {
      console.error("Error saving recipe: ", error);
      throw error;
    }
    return data;
  },

  async toggleFavoriteRecipe(id, favoriteStatus) {
    if (!this.isLoggedIn()) return;
    const { error } = await this.client
      .from("recipes")
      .update({ favorite: favoriteStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling favorite: ", error);
    }
  },

  async deleteRecipe(id) {
    if (!this.isLoggedIn()) return;
    const { error } = await this.client
      .from("recipes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting recipe: ", error);
    }
  },

  // 3. Weekly Planner Queries
  async fetchPlanner() {
    if (!this.isLoggedIn()) return {};
    const { data, error } = await this.client
      .from("weekly_planner")
      .select("*");

    if (error) {
      console.error("Error fetching planner: ", error);
      return {};
    }

    const planner = {};
    data.forEach(row => {
      const day = row.day_of_week;
      const type = row.meal_type;
      
      if (!planner[day]) {
        planner[day] = { breakfast: null, lunch: null, dinner: null, snack: null };
      }
      
      if (row.custom_meal_data) {
        planner[day][type] = row.custom_meal_data;
      } else if (row.recipe_id) {
        // Find corresponding recipe data or fill dummy placeholder
        planner[day][type] = { id: row.recipe_id, recipe_id: row.recipe_id };
      }
    });

    return planner;
  },

  async savePlannerSlot(day, slot, meal) {
    if (!this.isLoggedIn()) return;
    
    // First, try deleting any existing slot for this day/slot
    await this.deletePlannerSlot(day, slot);

    const row = {
      user_id: this.currentUser.id,
      day_of_week: day,
      meal_type: slot
    };

    // If it's a customized custom meal (has no UUID or starts with custom-)
    if (meal.id && !meal.id.startsWith("custom-") && meal.id.length > 20) {
      row.recipe_id = meal.id;
    } else {
      row.custom_meal_data = {
        id: meal.id || `custom-${Date.now()}`,
        name: meal.name,
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        carbs: Number(meal.carbs) || 0,
        fats: Number(meal.fats) || 0
      };
    }

    const { error } = await this.client
      .from("weekly_planner")
      .insert([row]);

    if (error) {
      console.error("Error saving planner slot: ", error);
    }
  },

  async deletePlannerSlot(day, slot) {
    if (!this.isLoggedIn()) return;
    const { error } = await this.client
      .from("weekly_planner")
      .delete()
      .eq("user_id", this.currentUser.id)
      .eq("day_of_week", day)
      .eq("meal_type", slot);

    if (error) {
      console.error("Error deleting planner slot: ", error);
    }
  },

  // 4. Logged Meals Queries
  async fetchLogs() {
    if (!this.isLoggedIn()) return [];
    const { data, error } = await this.client
      .from("logged_meals")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching logs: ", error);
      return [];
    }
    return data.map(l => ({
      id: l.id,
      name: l.name,
      calories: l.calories,
      protein: l.protein,
      carbs: l.carbs,
      fats: l.fats,
      tags: l.tags,
      timestamp: l.timestamp,
      mealType: l.meal_type
    }));
  },

  async saveLog(logItem) {
    if (!this.isLoggedIn()) return null;
    const row = {
      user_id: this.currentUser.id,
      name: logItem.name,
      calories: Number(logItem.calories) || 0,
      protein: Number(logItem.protein) || 0,
      carbs: Number(logItem.carbs) || 0,
      fats: Number(logItem.fats) || 0,
      tags: logItem.tags || [],
      timestamp: logItem.timestamp,
      meal_type: logItem.mealType
    };

    const { data, error } = await this.client
      .from("logged_meals")
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error("Error saving logged meal: ", error);
      throw error;
    }
    return data;
  },

  async deleteLog(id) {
    if (!this.isLoggedIn()) return;
    const { error } = await this.client
      .from("logged_meals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting logged meal: ", error);
    }
  },

  // 5. Reminders Queries
  async fetchReminders() {
    if (!this.isLoggedIn()) return [];
    const { data, error } = await this.client
      .from("reminders")
      .select("*")
      .order("created_at", { ascending: true }); // Need created_at to preserve order

    if (error) {
      // Return empty or fallback
      console.error("Error fetching reminders: ", error);
      return [];
    }
    return data;
  },

  async saveReminder(text) {
    if (!this.isLoggedIn()) return null;
    const row = {
      user_id: this.currentUser.id,
      text: text,
      completed: false
    };

    const { data, error } = await this.client
      .from("reminders")
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error("Error saving reminder: ", error);
      throw error;
    }
    return data;
  },

  async toggleReminder(id, completedStatus) {
    if (!this.isLoggedIn()) return;
    const { error } = await this.client
      .from("reminders")
      .update({ completed: completedStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling reminder: ", error);
    }
  },

  async deleteReminder(id) {
    if (!this.isLoggedIn()) return;
    const { error } = await this.client
      .from("reminders")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting reminder: ", error);
    }
  }
};

// Initialize immediately
SupabaseService.init();
window.SupabaseService = SupabaseService;

// Listen for config changes
window.addEventListener("supabaseConfigChanged", () => {
  SupabaseService.init();
});
