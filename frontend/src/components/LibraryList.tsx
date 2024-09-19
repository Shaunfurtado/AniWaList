import React from "react";
import { LibraryItem } from "../types";
import { addToWatchlist } from "../api";

interface LibraryListProps {
  libraryList: LibraryItem[];
}

const LibraryList: React.FC<LibraryListProps> = ({ libraryList }) => {
  const handleAddToWatchlist = async (title: string) => {
    const success = await addToWatchlist(title);
    if (success) {
      console.log("Anime added to watchlist successfully");
    } else {
      console.error("Error adding anime to watchlist");
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
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {libraryList.map((item) => (
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
        ))}
      </tbody>
    </table>
  );
};

export default LibraryList;