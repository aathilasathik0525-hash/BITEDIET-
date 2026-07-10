function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-700 to-green-500 text-white">

      <div className="max-w-7xl mx-auto px-6 py-24">

        <h1 className="text-6xl font-bold">
          Eat Healthy.
        </h1>

        <h2 className="text-6xl font-bold mt-4">
          Live Better.
        </h2>

        <p className="mt-8 text-xl max-w-2xl">
          Personalized recipe recommendation system for
          Diabetes, Blood Pressure and Healthy users.
        </p>

        <button className="mt-10 bg-white text-green-700 px-8 py-4 rounded-full font-bold hover:scale-105 duration-300">
          Explore Recipes
        </button>

      </div>

    </section>
  );
}

export default Hero;