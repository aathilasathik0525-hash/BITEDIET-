import Navbar from "../components/layout/Navbar";

function Settings() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-700">⚙️ Settings</h1>
        <p className="text-xl text-gray-500">Settings and customization options will appear here.</p>
      </div>
    </>
  );
}

export default Settings;