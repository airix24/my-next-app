import React, { useState } from "react";

interface Player {
  name: string;
  position: string;
  team: string;
  opponent: string;
}

interface PlayerQueueProps {
  queue: Player[];
  removeFromQueue: (player: Player) => void;
  handleDraft: (player: Player) => void;
  isDraftOver: boolean;
  updateQueue: (newQueue: Player[]) => void;
}

const PlayerQueue: React.FC<PlayerQueueProps> = ({
  queue,
  removeFromQueue,
  handleDraft,
  isDraftOver,
  updateQueue,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text"));
    if (dragIndex === dropIndex) return;

    const newQueue = [...queue];
    const [removed] = newQueue.splice(dragIndex, 1);
    newQueue.splice(dropIndex, 0, removed);
    updateQueue(newQueue);
    setDraggedIndex(null);
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-4">
      <h2 className="text-lg font-bold mb-3">Draft Queue</h2>
      {queue.length === 0 ? (
        <p className="text-sm">
          Your queue is empty. Star players to add them here.
        </p>
      ) : (
        <ul className="space-y-2">
          {queue.map((player, index) => (
            <li
              key={player.name}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index)}
              className={`flex justify-between items-center bg-base-100 p-2 rounded-md shadow-sm ${
                index === draggedIndex ? "opacity-50" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{player.name}</span>
                <span className="text-xs text-gray-500">
                  {player.position} - {player.team} vs {player.opponent}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleDraft(player)}
                  disabled={isDraftOver}
                  className="btn btn-xs btn-primary"
                >
                  Draft
                </button>
                <button
                  onClick={() => removeFromQueue(player)}
                  className="btn btn-xs btn-outline btn-error"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerQueue;
