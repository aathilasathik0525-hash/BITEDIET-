function SearchBar({ search, setSearch }) {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-6">
      <input
        type="text"
        placeholder="🔍 Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default SearchBar;