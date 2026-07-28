import { useNavigate } from "react-router-dom";

function PatientSelection() {
  const navigate = useNavigate();

  const choose = (type) => {
    localStorage.setItem("patientType", type);
    
    try {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
      userProfile.patientType = type;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const updatedUsers = registeredUsers.map(user => {
        if (
          (user.username && user.username === userProfile.username) || 
          (user.email && user.email === userProfile.email)
        ) {
          return { ...user, patientType: type };
        }
        return user;
      });
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    } catch (e) {
      console.error("Failed to save patient selection permanently", e);
    }

    navigate("/home");
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