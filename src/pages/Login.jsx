import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../firebase/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const trimmedInput = String(email || "").trim();
    const trimmedPassword = String(password || "");

    try {
      try {
        await loginUser(trimmedInput, trimmedPassword);
      } catch (firebaseError) {
        console.warn("Firebase login unavailable, using saved user fallback.", firebaseError);
      }

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const matchedUser = registeredUsers.find(
        (user) => 
          (String(user.email || "").toLowerCase() === trimmedInput.toLowerCase() || 
           String(user.username || "").toLowerCase() === trimmedInput.toLowerCase()) && 
          String(user.password || "") === trimmedPassword
      );

      if (!matchedUser) {
        alert("Invalid username/email or password.");
        return;
      }

      localStorage.setItem("userProfile", JSON.stringify(matchedUser));
      
      // Restore patientType if it exists in the saved user profile
      if (matchedUser.patientType) {
        localStorage.setItem("patientType", matchedUser.patientType);
      } else {
        localStorage.removeItem("patientType");
      }

      alert("Login Successful ✅");
      
      if (matchedUser.patientType) {
        navigate("/home");
      } else {
        navigate("/patient");
      }
    } catch (error) {
      alert(error.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center p-4">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-green-600 mb-2">
          BiteDiet 🥗
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Welcome Back
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-4 mb-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-4 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700"
        >
          Login
        </button>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-bold">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;