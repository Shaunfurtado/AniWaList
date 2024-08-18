// pages/index.tsx
"use client";
import { useState, useEffect } from "react";

interface Anime {
  id: number;
  title: string;
  status: string;
}

interface LibraryItem {
  id: number;
  title: string;
}

const API_URL = "http://localhost:3001";

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [libraryList, setLibraryList] = useState<LibraryItem[]>([]);
  const [titles, setTitles] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleScanLibrary = async () => {
    setIsScanning(true);
    try {
      const response = await fetch(`${API_URL}/api/scan-library`, {
        method: "POST",
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Error scanning library:", error);
      setScanResult({ success: false, message: "Error scanning library" });
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (showLibrary) {
      fetchLibraryList();
    } else {
      fetchAnimeList();
    }
  }, [currentPage, filter, showLibrary]);

  const fetchAnimeList = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/anime?page=${currentPage}&filter=${filter}`
      );
      const data = await response.json();
      setAnimeList(data.anime);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching anime list:", error);
    }
  };

  const fetchLibraryList = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/library?page=${currentPage}`
      );
      const data = await response.json();
      setLibraryList(data.library);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching library list:", error);
    }
  };

  const handleAddAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/anime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles, status }),
      });
      if (response.ok) {
        setTitles("");
        setStatus("");
        fetchAnimeList();
      } else {
        console.error("Error adding anime:", await response.text());
      }
    } catch (error) {
      console.error("Error adding anime:", error);
    }
  };

  const handleAddToWatchlist = async (title: string) => {
    try {
      const response = await fetch(`${API_URL}/api/anime`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles: title, status: "yet to watch" }),
      });
      if (response.ok) {
        console.log("Anime added to watchlist successfully");
      } else {
        console.error("Error adding anime to watchlist:", await response.text());
      }
    } catch (error) {
      console.error("Error adding anime to watchlist:", error);
    }
  };

  const handleEdit = (anime: Anime) => {
    setEditingId(anime.id);
    setEditTitle(anime.title);
    setEditStatus(anime.status);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      const response = await fetch(`${API_URL}/api/anime/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, status: editStatus }),
      });
      if (response.ok) {
        setEditingId(null);
        fetchAnimeList();
      } else {
        console.error("Error updating anime:", await response.text());
      }
    } catch (error) {
      console.error("Error updating anime:", error);
    }
  };

  return (
    <main className="flex flex-col justify-between p-24">
      <div>
        <div className="sm:hidden p-4">
          <label htmlFor="Tab" className="sr-only">
            Tab
          </label>

          <select id="Tab" className="w-full rounded-md">
            <option>Home</option>
          </select>
        </div>

        <div className="hidden sm:block">
          <div className="border-b -mb-px flex gap-6">
            <a
              href="/"
              className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Anime List
              </h1>
            </a>
          </div>
        </div>
      </div>

      <div>
        <button onClick={handleScanLibrary} disabled={isScanning}>
          {isScanning ? "Scanning..." : "Scan Anime Library"}
        </button>
        {scanResult && (
          <p>
            {scanResult.success
              ? scanResult.message
              : "Error: " + scanResult.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showLibrary}
            onChange={() => setShowLibrary(!showLibrary)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Show Library</span>
        </label>
      </div>

      {!showLibrary && (
        <>
          <form onSubmit={handleAddAnime} className="mb-6">
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
                const statusSelected = document.querySelector('input[name="status"]:checked');
                if (!statusSelected) {
                  e.preventDefault();
                  alert("Please select either 'Completed' or 'Yet to Watch'");
                }
              }}
              className="inline-block rounded-xl border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            >
              Add Anime
            </button>
          </form>

          <div className="mb-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg border-gray-300 text-gray-700"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="yet to watch">Yet to Watch</option>
            </select>
          </div>
        </>
      )}

      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              Title
            </th>
            {showLibrary ? (
              <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Action
              </th>
            ) : (
              <>
                <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Status
                </th>
                <th className="border p-2 whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Actions
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {showLibrary
            ? libraryList.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2 text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleAddToWatchlist(item.title)}
                      className="block rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      Add to Watchlist
                    </button>
                  </td>
                </tr>
              ))
            : animeList.map((anime) => (
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
                      <button
                        onClick={handleSaveEdit}
                        className="block rounded-full bg-green-500 px-8 py-3 text-sm font-medium group-hover:bg-transparent"
                      >
                        Save
                      </button>
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

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 bg-gray-200 rounded"
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="mx-1 px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </main>
  );
}
