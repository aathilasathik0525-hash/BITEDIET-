function Categories() {
  const items = [
    "🥗 Breakfast",
    "🍛 Lunch",
    "🍲 Dinner",
    "🥤 Drinks",
    "🥜 Snacks",
    "🍎 Fruits",
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-4xl font-bold mb-10">
        Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

        {items.map((item) => (
          <button
            key={item}
            className="bg-green-100 hover:bg-green-600 hover:text-white p-5 rounded-2xl transition"
          >
            {item}
          </button>
        ))}

      </div>

    </section>
  );
}

export default Categories;