import { useState } from "react";
import { Mic } from "lucide-react";

function SearchBar({ search, setSearch }) {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6 relative flex items-center">
      <input
        type="text"
        placeholder={isListening ? "Listening..." : "Search recipes..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleVoiceSearch}
        type="button"
        className={`absolute right-10 p-2 rounded-full hover:bg-gray-100 transition-colors ${
          isListening ? "text-red-500 animate-pulse bg-red-50" : "text-gray-500"
        }`}
        title="Search by voice"
      >
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
}

export default SearchBar;