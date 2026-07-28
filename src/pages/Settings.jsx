import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";

function Settings() {
  // 1. Account Settings
  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem("userProfile")) || {
      fullName: "Guest User",
      email: "guest@bitediet.com",
      username: "guest",
      password: ""
    };
  });
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    fullName: profile.fullName,
    email: profile.email
  });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // 2. Health Preferences
  const [patientType, setPatientType] = useState(() => {
    return localStorage.getItem("patientType") || "Normal";
  });
  const [calorieGoal, setCalorieGoal] = useState(() => {
    return localStorage.getItem("dailyCalorieGoal") || "2000";
  });

  // 3. Notifications Toggles
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("settings_notifications");
    return saved ? JSON.parse(saved) : { meal: true, water: true, timer: true };
  });

  // 4. Appearance
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("settings_darkMode") === "true";
  });

  // 5. Voice Search Settings
  const [voiceSearchEnabled, setVoiceSearchEnabled] = useState(() => {
    return localStorage.getItem("settings_voiceSearch") !== "false";
  });
  const [micStatus, setMicStatus] = useState("Checking...");

  // 6. Nutrition Preferences
  const [nutritionPrefs, setNutritionPrefs] = useState(() => {
    const saved = localStorage.getItem("settings_nutritionPrefs");
    return saved ? JSON.parse(saved) : { calories: true, protein: true, carbs: true, fat: true };
  });

  // Check Microphone Permission on mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "microphone" })
        .then((permissionStatus) => {
          setMicStatus(permissionStatus.state);
          permissionStatus.onchange = () => {
            setMicStatus(permissionStatus.state);
          };
        })
        .catch(() => {
          setMicStatus("Unsupported");
        });
    } else {
      setMicStatus("Unsupported");
    }
  }, []);

  // Save triggers
  const handleSaveHealthPrefs = (type, goal) => {
    localStorage.setItem("patientType", type);
    localStorage.setItem("dailyCalorieGoal", goal);

    try {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      userProfile.patientType = type;
      userProfile.dailyCalorieGoal = goal;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const updatedUsers = registeredUsers.map(user => {
        if (
          (user.username && user.username === userProfile.username) || 
          (user.email && user.email === userProfile.email)
        ) {
          return { ...user, patientType: type, dailyCalorieGoal: goal };
        }
        return user;
      });
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    } catch (e) {
      console.error("Failed to save health preferences permanently", e);
    }

    alert("Health preferences updated successfully! ✅");
  };

  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("settings_notifications", JSON.stringify(updated));
  };

  const toggleNutritionPref = (key) => {
    const updated = { ...nutritionPrefs, [key]: !nutritionPrefs[key] };
    setNutritionPrefs(updated);
    localStorage.setItem("settings_nutritionPrefs", JSON.stringify(updated));
  };

  const handleToggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem("settings_darkMode", String(nextMode));
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleToggleVoiceSearch = () => {
    const nextVal = !voiceSearchEnabled;
    setVoiceSearchEnabled(nextVal);
    localStorage.setItem("settings_voiceSearch", String(nextVal));
  };

  // Account actions
  const handleSaveAccount = () => {
    if (!accountForm.fullName.trim() || !accountForm.email.trim()) {
      alert("Name and Email cannot be empty.");
      return;
    }
    const updated = { ...profile, fullName: accountForm.fullName, email: accountForm.email };
    setProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));

    // Update in registeredUsers list as well
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map(user => {
      if (user.username === profile.username) {
        return { ...user, fullName: accountForm.fullName, email: accountForm.email };
      }
      return user;
    });
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    setIsEditingAccount(false);
    alert("Account updated successfully! ✅");
  };

  const handleChangePassword = () => {
    if (passForm.currentPassword !== profile.password) {
      alert("Incorrect current password.");
      return;
    }
    if (passForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    const updated = { ...profile, password: passForm.newPassword };
    setProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map(user => {
      if (user.username === profile.username) {
        return { ...user, password: passForm.newPassword };
      }
      return user;
    });
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    setIsChangingPass(false);
    setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password updated successfully! ✅");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("patientType");
      window.location.href = "/login";
    }
  };

  // Data management
  const handleClearData = (key, friendlyName) => {
    if (confirm(`Are you sure you want to clear your ${friendlyName}? This action cannot be undone.`)) {
      if (key === "fridge") {
        localStorage.removeItem("fridgeIngredients");
      } else if (key === "planner") {
        localStorage.removeItem("weeklyMealPlanner");
      } else if (key === "search") {
        localStorage.removeItem("searchHistory");
      } else if (key === "history") {
        localStorage.removeItem("recentlyViewedRecipes");
      }
      alert(`${friendlyName} cleared successfully! ✅`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <h1 className="text-4xl font-bold mb-8 text-green-700">⚙️ Settings</h1>

        <div className="space-y-8">
          {/* 1. ACCOUNT SECTION */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">👤 Account Settings</h2>
            
            {!isEditingAccount ? (
              <div className="space-y-3">
                <p><strong>Name:</strong> {profile.fullName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Username:</strong> {profile.username}</p>

                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                  <button
                    onClick={() => setIsEditingAccount(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsChangingPass(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-sm block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={accountForm.fullName}
                    onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                    className="w-full border p-3 rounded-xl text-gray-700 bg-white focus:ring-1 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm block mb-1">Email</label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    className="w-full border p-3 rounded-xl text-gray-700 bg-white focus:ring-1 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveAccount}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingAccount(false)}
                    className="bg-gray-400 hover:bg-gray-550 text-white px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isChangingPass && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-4">
                <h3 className="font-bold text-blue-800">Change Password</h3>
                <div>
                  <label className="text-blue-900 text-sm block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    className="w-full border p-3 rounded-xl text-gray-700 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-blue-900 text-sm block mb-1">New Password</label>
                  <input
                    type="password"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    className="w-full border p-3 rounded-xl text-gray-700 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-blue-900 text-sm block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    className="w-full border p-3 rounded-xl text-gray-700 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => setIsChangingPass(false)}
                    className="bg-gray-400 hover:bg-gray-550 text-white px-4 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. HEALTH PREFERENCES */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🍽️ Health Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm block mb-1">Health Category / Patient Type</label>
                <select
                  value={patientType}
                  onChange={(e) => setPatientType(e.target.value)}
                  className="w-full border p-3 rounded-xl bg-white text-gray-700 focus:ring-1 focus:ring-green-500 outline-none"
                >
                  <option value="Diabetes">Diabetes</option>
                  <option value="Blood Pressure">Blood Pressure (BP)</option>
                  <option value="Normal">Normal User</option>
                </select>
              </div>

              <div>
                <label className="text-gray-500 text-sm block mb-1">Daily Calorie Goal (kcal)</label>
                <input
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(e.target.value)}
                  className="w-full border p-3 rounded-xl bg-white text-gray-700 focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>

              <button
                onClick={() => handleSaveHealthPrefs(patientType, calorieGoal)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* 3. NOTIFICATIONS */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🔔 Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
                <div>
                  <span className="font-semibold text-gray-700">Meal Reminders</span>
                  <p className="text-xs text-gray-400">Receive alerts before planned meals</p>
                </div>
                <button
                  onClick={() => toggleNotification("meal")}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    notifications.meal ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
                <div>
                  <span className="font-semibold text-gray-700">Water Reminders</span>
                  <p className="text-xs text-gray-400">Hydration target alerts</p>
                </div>
                <button
                  onClick={() => toggleNotification("water")}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    notifications.water ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
                <div>
                  <span className="font-semibold text-gray-700">Cooking Timer Alerts</span>
                  <p className="text-xs text-gray-400">Timer complete push alerts</p>
                </div>
                <button
                  onClick={() => toggleNotification("timer")}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    notifications.timer ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. APPEARANCE */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🌙 Appearance</h2>
            <div className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
              <div>
                <span className="font-semibold text-gray-700">{darkMode ? "Dark Mode Active" : "Light Mode Active"}</span>
                <p className="text-xs text-gray-400">Switch application style theme</p>
              </div>
              <button
                onClick={handleToggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  darkMode ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
          </div>

          {/* 5. VOICE SEARCH */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🎤 Voice Search Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
                <div>
                  <span className="font-semibold text-gray-700">Enable Voice Search Microphone</span>
                  <p className="text-xs text-gray-400">Toggle voice control search utility</p>
                </div>
                <button
                  onClick={handleToggleVoiceSearch}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    voiceSearchEnabled ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

              <div className="p-3 border rounded-xl bg-gray-50 flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Microphone Permission Status:</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  micStatus === "granted" ? "bg-green-150 text-green-800" :
                  micStatus === "denied" ? "bg-red-150 text-red-800" : "bg-yellow-150 text-yellow-800"
                }`}>
                  {micStatus}
                </span>
              </div>
            </div>
          </div>

          {/* 6. NUTRITION PREFERENCES */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">📊 Nutrition Preferences</h2>
            <p className="text-gray-500 text-sm mb-4">Choose which macronutrients to display in recipe cards and summaries.</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(nutritionPrefs).map((key) => (
                <div key={key} className="flex justify-between items-center p-3 border rounded-xl bg-gray-50">
                  <span className="capitalize font-semibold text-gray-700">{key}</span>
                  <button
                    onClick={() => toggleNutritionPref(key)}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                      nutritionPrefs[key] ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 7. DATA MANAGEMENT */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🧹 Data Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleClearData("search", "Search History")}
                className="border border-red-200 text-red-600 hover:bg-red-50 p-4 rounded-2xl font-semibold transition text-left cursor-pointer"
              >
                Clear Search History
              </button>
              <button
                onClick={() => handleClearData("history", "Recently Viewed Recipes")}
                className="border border-red-200 text-red-600 hover:bg-red-50 p-4 rounded-2xl font-semibold transition text-left cursor-pointer"
              >
                Clear Recently Viewed Recipes
              </button>
              <button
                onClick={() => handleClearData("planner", "Weekly Meal Planner")}
                className="border border-red-200 text-red-600 hover:bg-red-50 p-4 rounded-2xl font-semibold transition text-left cursor-pointer"
              >
                Clear Meal Planner
              </button>
              <button
                onClick={() => handleClearData("fridge", "Fridge Ingredients")}
                className="border border-red-200 text-red-600 hover:bg-red-50 p-4 rounded-2xl font-semibold transition text-left cursor-pointer"
              >
                Clear Fridge Ingredients
              </button>
            </div>
          </div>

          {/* 8. ABOUT */}
          <div className="bg-white rounded-3xl shadow p-6 border border-gray-150">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">ℹ️ About</h2>
            <div className="space-y-4">
              <div className="p-3 border rounded-xl bg-gray-50 flex justify-between">
                <span className="font-semibold text-gray-650">BiteDiet Version</span>
                <span className="font-bold text-green-700">v1.0 (Stable Release)</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-semibold text-green-650">
                <a href="#" onClick={() => alert("Privacy Policy")} className="hover:underline">Privacy Policy</a>
                <span>•</span>
                <a href="#" onClick={() => alert("Terms & Conditions")} className="hover:underline">Terms & Conditions</a>
                <span>•</span>
                <a href="#" onClick={() => alert("Contact Support at support@bitediet.com")} className="hover:underline">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;