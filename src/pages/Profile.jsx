import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem("userProfile")) || {
      fullName: "Guest User",
      email: "guest@bitediet.com",
      username: "guest",
      password: ""
    };
  });

  const patientType = localStorage.getItem("patientType") || "Normal";
  const [activeTab, setActiveTab] = useState("My Profile");

  // Profile fields state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: profile.fullName,
    email: profile.email
  });

  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Reminders state
  const [reminders, setReminders] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: false
  });

  const handleEditSave = () => {
    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      alert("Name and Email cannot be empty!");
      return;
    }

    const updatedProfile = { ...profile, fullName: editForm.fullName, email: editForm.email };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map(user => {
      if (user.username === profile.username) {
        return { ...user, fullName: editForm.fullName, email: editForm.email };
      }
      return user;
    });
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    setIsEditing(false);
    alert("Profile updated successfully! ✅");
  };

  const handleChangePassword = () => {
    if (passwordForm.currentPassword !== profile.password) {
      alert("Incorrect current password!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters!");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const updatedProfile = { ...profile, password: passwordForm.newPassword };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = registeredUsers.map(user => {
      if (user.username === profile.username) {
        return { ...user, password: passwordForm.newPassword };
      }
      return user;
    });
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    setIsChangingPassword(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password changed successfully! ✅");
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("patientType");
    window.location.href = "/";
  };

  const menuOptions = [
    { name: "My Profile", icon: "👤" },
    { name: "Cookbook", icon: "📖", action: () => navigate("/cookbook") },
    { name: "Meal Reminder", icon: "⏰" },
    { name: "Settings", icon: "⚙️", action: () => navigate("/settings") },
    { name: "Help & Support", icon: "❓" },
    { name: "About BiteDiet", icon: "ℹ️" },
    { name: "Logout", icon: "🚪", action: handleLogout }
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-full md:w-80 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 self-start">
            <div className="flex flex-col items-center mb-6 border-b pb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-500 shadow-inner overflow-hidden mb-3">
                <svg className="w-14 h-14 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h2 className="font-bold text-xl text-gray-800">{profile.fullName}</h2>
              <p className="text-gray-400 text-sm">{profile.email}</p>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-200 mt-2">
                🩺 {patientType}
              </span>
            </div>

            <nav className="space-y-1">
              {menuOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={opt.action ? opt.action : () => { setActiveTab(opt.name); setIsEditing(false); setIsChangingPassword(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3 ${
                    activeTab === opt.name && !opt.action
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  {opt.name}
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT VIEW AREA */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            
            {activeTab === "My Profile" && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">👤 My Profile</h2>

                {!isEditing ? (
                  <div className="space-y-4 text-lg">
                    <div>
                      <label className="text-gray-400 text-sm block">Full Name</label>
                      <p className="font-semibold text-gray-700">{profile.fullName}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block">Email ID</label>
                      <p className="font-semibold text-gray-700">{profile.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block">Username</label>
                      <p className="font-semibold text-gray-700">{profile.username}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-8 pt-4 border-t">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 font-semibold"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 font-semibold"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="w-full border rounded-xl p-3 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1">Email ID</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full border rounded-xl p-3 text-gray-700"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleEditSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-400 text-white px-6 py-2 rounded-xl hover:bg-gray-500 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isChangingPassword && (
                  <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-4">
                    <h3 className="text-xl font-bold text-blue-800">🔑 Change Password</h3>
                    <div>
                      <label className="text-blue-900 text-sm block mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full border rounded-xl p-3 text-gray-700 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-blue-900 text-sm block mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full border rounded-xl p-3 text-gray-700 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-blue-900 text-sm block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full border rounded-xl p-3 text-gray-700 bg-white"
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={handleChangePassword}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-semibold"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(false)}
                        className="bg-gray-400 text-white px-6 py-2 rounded-xl hover:bg-gray-500 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Meal Reminder" && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">⏰ Meal Reminders</h2>
                <p className="text-gray-500 mb-6">Receive reminders to eat your custom recipes on time.</p>
                
                <div className="space-y-4">
                  {Object.entries(reminders).map(([meal, enabled]) => (
                    <div key={meal} className="flex justify-between items-center p-4 border rounded-2xl">
                      <div>
                        <span className="capitalize font-semibold text-lg text-gray-700">{meal} Reminder</span>
                        <p className="text-sm text-gray-400">Receive alert 15 mins before time</p>
                      </div>
                      <button
                        onClick={() => setReminders({ ...reminders, [meal]: !enabled })}
                        className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${
                          enabled ? "bg-green-600 justify-end" : "bg-gray-300 justify-start"
                        }`}
                      >
                        <div className="w-6 h-6 bg-white rounded-full shadow" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Help & Support" && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">❓ Help & Support</h2>
                <p className="text-gray-500 mb-6">Have queries or facing technical difficulties? Get in touch with us.</p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border rounded-2xl">
                    <h4 className="font-bold text-gray-800">✉️ Email Support</h4>
                    <p className="text-gray-600 mt-1">support@bitediet.com</p>
                  </div>
                  <div className="p-4 bg-gray-50 border rounded-2xl">
                    <h4 className="font-bold text-gray-800">📞 Phone Support</h4>
                    <p className="text-gray-600 mt-1">+1 (800) 123-4567</p>
                  </div>
                  <div className="p-4 bg-gray-50 border rounded-2xl">
                    <h4 className="font-bold text-gray-800">🕒 Availability</h4>
                    <p className="text-gray-600 mt-1">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "About BiteDiet" && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">ℹ️ About BiteDiet</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  BiteDiet is a premium health-tech application built to empower users with customized recipe recommendations tailored specifically to manage conditions like Diabetes and High Blood Pressure.
                </p>
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-green-800">
                  <h4 className="font-bold">App Version</h4>
                  <p className="text-sm mt-1">v1.2.0 (Stable Release)</p>
                </div>
                <div className="p-6 bg-gray-50 border rounded-2xl text-gray-700">
                  <h4 className="font-bold">Cardiorespiratory & Blood Glucose Nutrition</h4>
                  <p className="text-sm mt-1">Developed in collaboration with certified nutritionists.</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
}

export default Profile;