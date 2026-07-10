import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../firebase/auth";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full Name cannot be empty.";

    if (!form.gender) nextErrors.gender = "Please select a gender.";

    if (!form.age.trim()) nextErrors.age = "Age is required.";
    else if (!/^\d+$/.test(form.age) || Number(form.age) < 1 || Number(form.age) > 120) {
      nextErrors.age = "Age should be a valid number.";
    }

    if (!form.phone.trim()) nextErrors.phone = "Phone Number is required.";
    else if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = "Phone Number must contain exactly 10 digits.";

    if (!form.email.trim()) nextErrors.email = "Email ID is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";

    if (!form.username.trim()) nextErrors.username = "Username is required.";
    else {
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const taken = existingUsers.some((user) => user.username.toLowerCase() === form.username.toLowerCase());
      if (taken) nextErrors.username = "Username already exists.";
    }

    if (!form.password) nextErrors.password = "Password is required.";
    else if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";

    if (!form.confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    return nextErrors;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    try {
      try {
        await registerUser(form.email, form.password);
      } catch (firebaseError) {
        console.warn("Firebase registration unavailable, using local fallback.", firebaseError);
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const updatedUsers = [...existingUsers, { ...form }];
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      localStorage.setItem("userProfile", JSON.stringify({ ...form }));

      alert("Registration Successful 🎉");
      navigate("/", { replace: true });
    } catch (error) {
      setErrors({ submit: error.message || "Registration failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-2">BiteDiet 🥗</h1>
        <p className="text-center text-gray-500 mb-8">Create Account</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                name="fullName"
                placeholder="Full Name"
                className="w-full border rounded-xl p-4"
                value={form.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <select
                name="gender"
                className="w-full border rounded-xl p-4"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                name="age"
                type="number"
                inputMode="numeric"
                placeholder="Age"
                className="w-full border rounded-xl p-4"
                value={form.age}
                onChange={handleChange}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                placeholder="Phone Number"
                className="w-full border rounded-xl p-4"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email ID"
                className="w-full border rounded-xl p-4"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                name="username"
                placeholder="Username"
                className="w-full border rounded-xl p-4"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border rounded-xl p-4"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="w-full border rounded-xl p-4"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account? <Link to="/" className="text-green-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;