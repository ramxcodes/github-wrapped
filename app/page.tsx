"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Home() {
  const [username, setUsername] = useState("");
  interface GitHubData {
    name: string;
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
    total_forks: number;
    total_commits: number;
    most_used_languages: string;
    fun_highlights: {
      estimated_ctrl_c_v: number;
      estimated_debug_hours: number;
      estimated_bug_cry_hours: number;
    };
    user_tier: string;
  }

  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubWrap = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub Wrap");
      }
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-r from-blue-950 via-purple-900 to-indigo-950 text-white px-4 gradient-animation"><FaGithub size={40} className="my-2" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl mb-8 font-bold text-center ">
       GitHub Wrapped
      </h1>
      <div className="flex flex-col md:flex-row items-center w-full max-w-lg mb-8 space-y-4 md:space-y-0">
        <input
          type="text"
          className="flex-1 w-full p-4 text-lg border border-gray-600 rounded-md outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-black"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-full md:w-auto p-4 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={fetchGitHubWrap}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Your Wrap"}
        </button>
      </div>
      {error && (
        <div className="text-red-500 mb-4 bg-red-100 p-4 rounded-md w-full max-w-lg text-center">
          Error: {error}
        </div>
      )}
      {data && (
        <div className="max-w-3xl flex flex-col items-center mt-8">
          <Card className="relative bg-gray-900 text-white shadow-md rounded-lg p-8 w-full sm:w-[400px]">
            {/* Tier Badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white w-16 h-16 flex justify-center items-center rounded-full text-lg font-bold shadow-lg border-4 border-gray-900">
              {data.user_tier}
            </div>

            <div className="text-center mt-8">
              <h2 className="text-lg sm:text-xl font-bold mb-2 uppercase gradient-text gradient-animation">
                {username} GitHub Wrap
              </h2>
              <p className="text-sm mb-4">
                A snapshot of your year on GitHub. 🚀
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm sm:text-base">
              <p>
                <strong>Name:</strong> {data.name}
              </p>
              <p>
                <strong>Public Repos:</strong> {data.public_repos} 🗂️
              </p>
              <p>
                <strong>Followers:</strong> {data.followers} 🌟
              </p>
              <p>
                <strong>Following:</strong> {data.following} 🌈
              </p>
              <p>
                <strong>Total Stars:</strong> {data.total_stars} ✨
              </p>
              <p>
                <strong>Total Forks:</strong> {data.total_forks} 🌐
              </p>
              <p>
                <strong>Favorite Language:</strong> {data.most_used_languages} 💻
              </p>
              <p>
                <strong>Ctrl+C + Ctrl+V Count:</strong>{" "}
                {data.fun_highlights.estimated_ctrl_c_v} 😂
              </p>
              <p>
                <strong>Debug Hours:</strong>{" "}
                {data.fun_highlights.estimated_debug_hours} 😅
              </p>
              <p>
                <strong>Bug Cry Hours:</strong>{" "}
                {data.fun_highlights.estimated_bug_cry_hours} 😭
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <a
                href={`https://twitter.com/ramxcodes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href={`https://www.linkedin.com/in/ramxcodes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-600 transition"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
