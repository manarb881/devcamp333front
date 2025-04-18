import React, { useState } from "react";
import axios from "axios";

export function Contact ()  {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/api/accounts/messages/", formData);
      setSuccess(true);
      setFormData({ username: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-purple-800 text-center">Send Us a Message</h2>
      {success && (
        <p className="text-green-600 text-center">Message sent successfully!</p>
      )}
      {error && <p className="text-red-600 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-purple-700 font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-purple-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-purple-700 font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-black px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 z-10"
          > 
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

