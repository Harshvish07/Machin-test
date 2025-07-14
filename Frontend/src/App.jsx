import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("home");
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [profileForm, setProfileForm] = useState({
    education: "",
    location: ""
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/profile")
      .then((res) => {
        setUser(res.data.user);
        setProfileForm({
          education: res.data.user.education || "",
          location: res.data.user.location || ""
        });
      })
      .catch(() => setUser(null));
  }, []);

  const handleAuth = () => {
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";
    axios
      .post(url, form)
      .then((res) => {
        setUser(res.data.user);
        setSection("dashboard");
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Authentication failed")
      );
  };

  const handleProfileUpdate = () => {
    axios
      .put("http://localhost:5000/api/auth/profile", profileForm)
      .then((res) => {
        setUser(res.data.user);
        setEditMode(false);
        alert("Profile updated");
      })
      .catch(() => alert("Update failed"));
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    setUser(null);
    setSection("home");
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">EduSite</h1>
          <div className="space-x-4">
            <button
              onClick={() => setSection("home")}
              className="text-gray-700 hover:text-blue-700"
            >
              Home
            </button>
            {user && (
              <button
                onClick={() => setSection("dashboard")}
                className="text-gray-700 hover:text-blue-700"
              >
                Dashboard
              </button>
            )}
            {!user ? (
              <>
                <button
                  onClick={() => {
                    setSection("auth");
                    setIsLogin(true);
                  }}
                  className="text-gray-700 hover:text-blue-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setSection("auth");
                    setIsLogin(false);
                  }}
                  className="text-gray-700 hover:text-blue-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {section === "home" && (
        <header className="h-screen bg-gradient-to-r from-blue-700 to-indigo-400 text-white flex flex-col justify-center items-center text-center">
          <img
            src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg"
            alt="education"
            className="mx-auto w-96 mb-6 rounded shadow"
          />
          <h1 className="text-5xl font-bold mb-4">
            EduSite: Empower Your Learning
          </h1>
          <p className="text-xl mb-6">
            Track your growth, manage your profile, and learn on your terms.
          </p>
          {!user ? (
            <button
              onClick={() => {
                setSection("auth");
                setIsLogin(false);
              }}
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={() => setSection("dashboard")}
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Go to Dashboard
            </button>
          )}
        </header>
      )}

      {/* Auth Section */}
      {section === "auth" && !user && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <div className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full border p-3 rounded focus:outline-none focus:ring"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-3 rounded focus:outline-none focus:ring"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border p-3 rounded focus:outline-none focus:ring"
              />
              <button
                onClick={handleAuth}
                className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
              >
                {isLogin ? "Login" : "Register"}
              </button>
              <p
                onClick={() => setIsLogin(!isLogin)}
                className="text-center text-sm text-blue-600 cursor-pointer"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Section */}
      {section === "dashboard" && user && (
        <section className="py-20 bg-gray-100">
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">
              Your Dashboard
            </h2>
            <p>
              <strong>Name:</strong> {user.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            {editMode ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block">Education</label>
                  <input
                    type="text"
                    value={profileForm.education}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        education: e.target.value
                      })
                    }
                    className="w-full border p-3 rounded focus:outline-none focus:ring"
                  />
                </div>
                <div>
                  <label className="block">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        location: e.target.value
                      })
                    }
                    className="w-full border p-3 rounded focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <p>
                  <strong>Education:</strong> {user.education || "Not set"}
                </p>
                <p>
                  <strong>Location:</strong> {user.location || "Not set"}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-6 bg-white text-center text-gray-600">
        © {new Date().getFullYear()} EduSite. All rights reserved.
      </footer>
    </div>
  );
}
