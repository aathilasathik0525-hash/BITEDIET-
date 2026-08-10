import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    if (!trimmedEmail || !trimmedPassword) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
          }),
        }
      );

      const result = await response.text();

      console.log("Backend response:", result);

      if (result === "User not found") {
        alert("User not found.");
        return;
      }

      if (result === "Invalid password") {
        alert("Invalid password.");
        return;
      }

      if (result === "Login successful") {
        // Save logged-in user
        const userProfile = {
          email: trimmedEmail,
        };

        localStorage.setItem(
          "userProfile",
          JSON.stringify(userProfile)
        );

        alert("Login Successful ✅");

        // Go to patient type selection
        navigate("/patient");

        return;
      }

      alert("Login failed: " + result);

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Cannot connect to BiteDiet backend. Make sure Spring Boot is running on port 8081."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

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
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-6">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-green-600 font-bold"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;