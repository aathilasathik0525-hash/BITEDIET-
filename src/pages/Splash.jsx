import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-400 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center animate-fadeIn duration-1000">
        <img
          src="/logo.jpg"
          alt="BiteDiet Logo"
          className="w-44 h-44 object-cover rounded-full shadow-2xl border-4 border-white mb-6 animate-pulse"
        />
        <h1 className="text-5xl font-black text-white tracking-wider drop-shadow-md">
          BiteDiet
        </h1>
        <p className="text-green-100 mt-2 font-medium tracking-wide text-lg">
          EAT HEALTHY • LIVE BETTER
        </p>
      </div>
    </div>
  );
}

export default Splash;
