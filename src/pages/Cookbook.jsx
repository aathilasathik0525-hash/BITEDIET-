import allRecipes from "../data/recipeCatalog";

function Cookbook() {
  const savedIds = JSON.parse(localStorage.getItem("cookbook")) || [];

  const savedRecipes = allRecipes.filter((recipe) =>
    savedIds.includes(recipe.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Cookbook
      </h1>

      {savedRecipes.length === 0 ? (
        <h2>No recipes saved yet.</h2>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {savedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <img
                src={recipe.image}
                className="w-full h-52 object-cover rounded-xl"
              />

              <h2 className="text-xl font-bold mt-3">
                {recipe.name}
              </h2>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Cookbook;