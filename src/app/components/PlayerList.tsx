import React, { useState, useMemo } from "react";
import { positions } from "../data/constants";

interface Player {
  name: string;
  position: string;
  team: string;
  opponent: string;
}

interface PlayerListProps {
  availablePlayers: Player[];
  isDraftOver: boolean;
  handleDraft: (player: Player) => void;
  addToQueue: (player: Player) => void;
  removeFromQueue: (player: Player) => void; // Add this line
  queuedPlayers: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({
  availablePlayers,
  isDraftOver,
  handleDraft,
  addToQueue,
  removeFromQueue, // Add this line
  queuedPlayers,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePositionClick = (pos: string) => {
    setSelectedPosition(selectedPosition === pos ? null : pos);
  };

  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter((player) => {
      const matchesPosition = selectedPosition
        ? player.position === selectedPosition
        : true;
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.opponent.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPosition && matchesSearch;
    });
  }, [availablePlayers, selectedPosition, searchTerm]);

  // Add this function to check if a player is queued
  const isPlayerQueued = (player: Player) => {
    return queuedPlayers.some(
      (queuedPlayer) => queuedPlayer.name === player.name
    );
  };

  const toggleQueue = (player: Player) => {
    if (isPlayerQueued(player)) {
      removeFromQueue(player);
    } else {
      addToQueue(player);
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {positions.map((pos) => (
          <button
            key={pos}
            className={`btn ${
              selectedPosition === null || selectedPosition === pos
                ? pos === "QB"
                  ? "bg-purple-400 text-purple-900"
                  : pos === "RB"
                  ? "bg-green-400 text-green-900"
                  : pos === "WR"
                  ? "bg-orange-400 text-orange-900"
                  : "bg-blue-400 text-blue-900"
                : "bg-gray-400 text-gray-700"
            } ${selectedPosition === pos ? "ring-2 ring-base-content" : ""}`}
            onClick={() => handlePositionClick(pos)}
          >
            {pos}
          </button>
        ))}
      </div>
      <div className="space-y-2 overflow-y-auto flex-grow">
        {filteredPlayers.map((player) => (
          <div
            key={player.name}
            className="flex items-center justify-between bg-base-100 p-2 rounded"
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  player.position === "QB"
                    ? "bg-purple-400 text-purple-900"
                    : player.position === "RB"
                    ? "bg-green-400 text-green-900"
                    : player.position === "WR"
                    ? "bg-orange-400 text-orange-900"
                    : "bg-blue-400 text-blue-900"
                }`}
              >
                {player.position}
              </div>
              <div>
                <div>{player.name}</div>
                <div className="text-xs text-base-content/60">
                  {player.team} vs {player.opponent}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isDraftOver && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDraft(player)}
                >
                  Draft
                </button>
              )}
              <button
                className="btn btn-ghost btn-sm p-2"
                onClick={() => toggleQueue(player)}
              >
                {isPlayerQueued(player) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
