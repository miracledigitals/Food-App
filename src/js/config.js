let initialUrl = "https://gnyddkfaeeonvzbkxinv.supabase.co";
let initialKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueWRka2ZhZWVvbnZ6Ymt4aW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2ODg2OTMsImV4cCI6MjA5NzI2NDY5M30.T2gfrW8F8KTAh5oMoGOyRfWKSW17ewBchjvPY4xYxIU";

try {
  const url = localStorage.getItem("supabase_url");
  const key = localStorage.getItem("supabase_key");
  if (url) initialUrl = url;
  if (key) initialKey = key;
} catch (e) {
  console.warn("Could not read Supabase config from localStorage:", e);
}

const Config = {
  SUPABASE_URL: initialUrl,
  SUPABASE_KEY: initialKey,

  save(url, key) {
    try {
      localStorage.setItem("supabase_url", url.trim());
      localStorage.setItem("supabase_key", key.trim());
    } catch (e) {
      console.warn("Could not save Supabase config to localStorage:", e);
    }
    this.SUPABASE_URL = url.trim();
    this.SUPABASE_KEY = key.trim();
    
    // Dispatch event to re-initialize client
    window.dispatchEvent(new CustomEvent("supabaseConfigChanged"));
  },

  clear() {
    try {
      localStorage.removeItem("supabase_url");
      localStorage.removeItem("supabase_key");
    } catch (e) {
      console.warn("Could not clear Supabase config from localStorage:", e);
    }
    this.SUPABASE_URL = "";
    this.SUPABASE_KEY = "";
    window.dispatchEvent(new CustomEvent("supabaseConfigChanged"));
  },

  isConfigured() {
    return this.SUPABASE_URL !== "" && this.SUPABASE_KEY !== "";
  }
};

window.Config = Config;
