import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function WelcomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) dispatch(logout());
  }, [dispatch]);

  return (
    <div className="bg-[#181A20] min-h-screen flex flex-col pt-16 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative flex items-center justify-center min-h-[80vh] px-4 py-25 sm:px-8"
        style={{
          backgroundImage: `url("https://images.pexels.com/photos/5598297/pexels-photo-5598297.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 z-0" />
        <div className="relative z-10 max-w-3xl text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Hire the best freelancers for any job, online.
          </h1>
          <ul className="text-white text-lg mb-8 space-y-2">
            {[
              "World's largest freelance marketplace",
              "Any job you can possibly think of",
              "Save up to 90% & get quotes for free",
              "Pay only when you're 100% happy",
            ].map((text, index) => (
              <li key={index} className="flex items-start justify-center sm:justify-start">
                <span className="mr-2 text-pink-500">•</span> {text}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4">
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-md text-base sm:text-lg transition-all w-full sm:w-auto">
              Hire a Freelancer
            </button>
            <button className="border border-white text-white font-semibold py-3 px-6 rounded-md text-base sm:text-lg hover:bg-white hover:text-black transition-all w-full sm:w-auto">
              Earn Money Freelancing
            </button>
          </div>
        </div>
      </section>

      {/* ORGANIZATION POWER SECTION */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-4 sm:px-8 py-16">
        <div className="flex-1 text-white w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Power your organisation's{" "}
            <span className="text-pink-500">competitive advantage</span>
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "Freelancer Enterprise",
                desc: "Company budget? Get more done for less. Use our workforce of millions to help your business achieve more.",
              },
              {
                title: "Innovation Challenges",
                desc: "Transform impossible challenges into breakthrough solutions through the world's largest innovation ecosystem.",
              },
              {
                title: "Freelancer API",
                desc: "Millions of professionals on demand. Why hire people when you can simply integrate our talented cloud workforce instead?",
              },
            ].map(({ title, desc }, i) => (
              <div key={i} className="p-4 rounded-lg hover:bg-[#23262F] transition-colors">
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="mb-2 text-gray-300">{desc}</p>
                <a href="#" className="text-pink-500 font-semibold hover:underline">
                  View more →
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          {/* New image URL added here */}
          <img
            src="https://images.pexels.com/photos/5598329/pexels-photo-5598329.jpeg"
            alt="Innovative Business Collaboration"
            className="rounded-lg w-full max-w-md object-contain shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* BRAND LOGOS */}
      <section className="bg-[#14151a] py-8 px-4">
        <p className="text-center text-white text-sm mb-4 opacity-70">As used by</p>
        <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 place-items-center">
          {["Adobe", "Facebook", "Deloitte", "IBM", "Airbus", "Telstra", "Fujitsu", "Google"].map((brand, i) => (
            <span key={i} className="text-white text-sm sm:text-base opacity-70 font-semibold">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center sm:text-left">
          Make it real <span className="text-pink-500">with Freelancer</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          {[
            {
              icon: "💼",
              title: "The best talent",
              desc: "Discover reliable professionals by exploring their portfolios and immersing yourself in feedback.",
            },
            {
              icon: "⚡",
              title: "Fast bids",
              desc: "Get quick, no-obligation quotes. 80% of jobs receive bids within 60 seconds.",
            },
            {
              icon: "✨",
              title: "Quality work",
              desc: "Freelancer's talent pool of 70M+ professionals ensures the right expert for your project.",
            },
            {
              icon: "🔄",
              title: "Be in control",
              desc: "Manage work with dashboards, messaging, and milestone payments.",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-[#23262F] p-5 rounded-lg hover:bg-[#2a2d36] transition-colors"
            >
              <div className="text-pink-500 text-2xl mb-3">{icon}</div>
              <h3 className="font-bold text-lg mb-3">{title}</h3>
              <p className="text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}