import { Anime, LibraryItem } from "../types";

const API_URL = "http://localhost:3001";

export const fetchAnimeList = async (
  currentPage: number,
  filter: string,
  setAnimeList: React.Dispatch<React.SetStateAction<Anime[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
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

export const fetchLibraryList = async (
  currentPage: number,
  setLibraryList: React.Dispatch<React.SetStateAction<LibraryItem[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
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

export const handleScanLibrary = async () => {
  try {
    const response = await fetch(`${API_URL}/api/scan-library`, {
      method: "POST",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error scanning library:", error);
    return { success: false, message: "Error scanning library" };
  }
};

export const addAnime = async (titles: string, status: string) => {
  try {
    const response = await fetch(`${API_URL}/api/anime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titles, status }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error adding anime:", error);
    return false;
  }
};

export const updateAnime = async (id: number, title: string, status: string) => {
  try {
    const response = await fetch(`${API_URL}/api/anime/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating anime:", error);
    return false;
  }
};

export const deleteAnime = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/api/anime/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting anime:", error);
    return false;
  }
};

export const addToWatchlist = async (title: string) => {
  try {
    const response = await fetch(`${API_URL}/api/anime`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titles: title, status: "yet to watch" }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error adding anime to watchlist:", error);
    return false;
  }
};