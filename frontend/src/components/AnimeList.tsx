import React, { useState } from "react";
import { Anime } from "@/types";
import { updateAnime, deleteAnime } from "@/api";

interface AnimeListProps {
  animeList: Anime[];
  fetchAnimeList: () => void;
}

const AnimeList: React.FC<AnimeListProps> = ({ animeList, fetchAnimeList }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const handleEdit = (anime: Anime) => {
    setEditingId(anime.id);
    setEditTitle(anime.title);
    setEditStatus(anime.status);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const success = await updateAnime(editingId, editTitle, editStatus);
    if (success) {
      setEditingId(null);
      fetchAnimeList();
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteAnime(id);
    if (success) {
      fetchAnimeList();
    }
  };

  return (
    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead className="ltr:text-left rtl:text-right">
        <tr>
          <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            Title
          </th>
          <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            Status
          </th>
          <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {animeList.map((anime) => (
          <tr key={anime.id}>
            <td className="border p-2 text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {editingId === anime.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-center p-2 rounded-md border-gray-300 py-2.5 pe-10 shadow-sm sm:text-sm"
                />
              ) : (
                anime.title
              )}
            </td>
            <td className="border p-2 text-center whitespace-nowrap px-4 py-2 font-medium ">
              {editingId === anime.id ? (
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="p-2 border rounded-lg border-gray-300 text-gray-700"
                >
                  <option value="completed">Completed</option>
                  <option value="yet to watch">Yet to Watch</option>
                </select>
              ) : (
                anime.status
              )}
            </td>
            <td className="border p-2 ">
              {editingId === anime.id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="block rounded-full bg-green-500 px-8 py-3 text-sm font-medium group-hover:bg-transparent"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(anime.id)}
                    className="block rounded-full bg-red-500 px-8 py-3 text-sm font-medium group-hover:bg-transparent"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(anime)}
                  className="block rounded-full bg-yellow-400 py-3 px-8 text-sm font-medium group-hover:bg-transparent"
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnimeList;