import React, { useState } from "react";
import { addAnime } from "../api";

interface AnimeFormProps {
  fetchAnimeList: () => void;
}

const AnimeForm: React.FC<AnimeFormProps> = ({ fetchAnimeList }) => {
  const [titles, setTitles] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAnime(titles, status);
    if (success) {
      setTitles("");
      setStatus("");
      fetchAnimeList();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={titles}
        onChange={(e) => setTitles(e.target.value)}
        className="w-full p-2 border rounded mb-2 border-blue-600 align-top shadow-sm sm:text-sm"
        placeholder="Enter anime titles (one per line)"
        rows={4}
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
          <input
            type="radio"
            name="status"
            value="completed"
            checked={status === "completed"}
            onChange={(e) => setStatus(e.target.value)}
          />{" "}
          Completed
        </label>
        <label className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
          <input
            type="radio"
            name="status"
            value="yet to watch"
            checked={status === "yet to watch"}
            onChange={(e) => setStatus(e.target.value)}
          />{" "}
          Yet to Watch
        </label>
      </div>
      <button
        type="submit"
        onClick={(e) => {
          if (!status) {
            e.preventDefault();
            alert("Please select either 'Completed' or 'Yet to Watch'");
          }
        }}
        className="inline-block rounded-xl border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
      >
        Add Anime
      </button>
    </form>
  );
};

export default AnimeForm;