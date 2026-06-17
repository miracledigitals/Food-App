const Config = {
  SUPABASE_URL: localStorage.getItem("supabase_url") || "",
  SUPABASE_KEY: localStorage.getItem("supabase_key") || "",

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
