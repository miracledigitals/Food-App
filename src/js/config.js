const Config = {
  SUPABASE_URL: localStorage.getItem("supabase_url") || "https://gnyddkfaeeonvzbkxinv.supabase.co",
  SUPABASE_KEY: localStorage.getItem("supabase_key") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueWRka2ZhZWVvbnZ6Ymt4aW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODg2OTMsImV4cCI6MjA5NzI2NDY5M30.T2gfrW8F8KTAh5oMoGOyRfWKSW17ewBchjvPY4xYxIU",

  save(url, key) {
    localStorage.setItem("supabase_url", url.trim());
    localStorage.setItem("supabase_key", key.trim());
    this.SUPABASE_URL = url.trim();
    this.SUPABASE_KEY = key.trim();
    
    // Dispatch event to re-initialize client
    window.dispatchEvent(new CustomEvent("supabaseConfigChanged"));
  },

  clear() {
    localStorage.removeItem("supabase_url");
    localStorage.removeItem("supabase_key");
    this.SUPABASE_URL = "";
    this.SUPABASE_KEY = "";
    window.dispatchEvent(new CustomEvent("supabaseConfigChanged"));
  },

  isConfigured() {
    return this.SUPABASE_URL !== "" && this.SUPABASE_KEY !== "";
  }
};

window.Config = Config;
