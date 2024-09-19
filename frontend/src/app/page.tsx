"use client";
import React, { useState, useEffect } from "react";
import { Anime, LibraryItem } from "@/types";
import { fetchAnimeList, fetchLibraryList, handleScanLibrary } from "@/api";
import AnimeForm from "../components/AnimeForm";
import AnimeList from "../components/AnimeList";
import LibraryList from "../components/LibraryList";
import Pagination from "../components/Pagination";

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [libraryList, setLibraryList] = useState<LibraryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [showLibrary, setShowLibrary] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (showLibrary) {
      fetchLibraryList(currentPage, setLibraryList, setTotalPages);
    } else {
      fetchAnimeList(currentPage, filter, setAnimeList, setTotalPages);
    }
  }, [currentPage, filter, showLibrary]);

  const handleScan = async () => {
    setIsScanning(true);
    const result = await handleScanLibrary();
    setScanResult(result);
    setIsScanning(false);
  };

  return (
    <main className="flex flex-col justify-between p-24">
      {/* Header */}
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

      {/* Scan Library Button */}
      <div>
        <button onClick={handleScan} disabled={isScanning}>
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

      {/* Toggle Library/Anime List */}
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

      {/* Anime Form */}
      {!showLibrary && <AnimeForm fetchAnimeList={() => fetchAnimeList(currentPage, filter, setAnimeList, setTotalPages)} />}

      {/* Filter */}
      {!showLibrary && (
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
      )}

      {/* Anime/Library List */}
      {showLibrary ? (
        <LibraryList libraryList={libraryList} />
      ) : (
        <AnimeList animeList={animeList} fetchAnimeList={() => fetchAnimeList(currentPage, filter, setAnimeList, setTotalPages)} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
}