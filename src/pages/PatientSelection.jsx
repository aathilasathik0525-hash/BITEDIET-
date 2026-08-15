import { useNavigate } from "react-router-dom";

function PatientSelection() {
  const navigate = useNavigate();

  const choose = async (type) => {
    try {
      // Get logged-in user
      const userProfile = JSON.parse(
        localStorage.getItem("userProfile") || "{}"
      );

      if (!userProfile.email) {
        alert("User information not found. Please login again.");
        navigate("/login");
        return;
      }

      // Save patient type locally
      localStorage.setItem("patientType", type);

      // Update user profile locally
      userProfile.patientType = type;

      localStorage.setItem(
        "userProfile",
        JSON.stringify(userProfile)
      );

      // Update patient type in MySQL through backend
      const response = await fetch(
        `http://localhost:8080/api/auth/patient-type?email=${encodeURIComponent(
          userProfile.email
        )}&patientType=${encodeURIComponent(type)}`,
        {
          method: "PUT",
        }
      );

      const result = await response.text();

      console.log("Patient type update:", result);

      if (!response.ok) {
        alert("Failed to save patient type.");
        return;
      }

      // Go to Home
      navigate("/home");

    } catch (error) {
      console.error(
        "Patient type update error:",
        error
      );

      alert(
        "Cannot connect to BiteDiet backend."
      );
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center items-center p-6 text-center">

      <h1 className="text-5xl font-bold text-green-700 mb-10">
        BiteDiet 🥗
      </h1>

      <h2 className="text-2xl mb-10">
        Select Your Health Condition
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <button
          onClick={() => choose("Diabetes")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white"
        >
          🩸 Diabetes
        </button>

        <button
          onClick={() => choose("Blood Pressure")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white"
        >
          ❤️ Blood Pressure
        </button>

        <button
          onClick={() => choose("Normal")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white"
        >
          😊 Normal
        </button>

      </div>

    </div>
  );
}

export default PatientSelection;