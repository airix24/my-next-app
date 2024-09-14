import React from "react";
import { Player } from "../data/types"; // Adjust the import path as needed

export interface AllPicks {
  teamNumber: number;
  player: Player | null;
}

export interface DraftTopBarProps {
  allPicks: AllPicks[];
  currentPick: number;
  teamNames: string[];
  USER_TEAM: number;
  currentTeam: number;
  isDraftOver: boolean;
  handleAutoDraft: () => void;
}

export default function DraftTopBar({
  allPicks,
  currentPick,
  teamNames,
  USER_TEAM,
}: DraftTopBarProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg">
      <div className="overflow-x-auto">
        <div className="flex space-x-2" style={{ minWidth: "max-content" }}>
          {allPicks.map((pick, index) => {
            const round = Math.floor(index / teamNames.length) + 1;
            const pickInRound = (index % teamNames.length) + 1;
            const pickNumber = `${round}.${pickInRound
              .toString()
              .padStart(2, "0")}`;

            return (
              <div
                key={index}
                className={`w-28 h-28 flex flex-col items-center justify-between p-2 ${
                  index === currentPick - 1
                    ? "bg-blue-900 border border-blue-500"
                    : "bg-gray-700"
                } ${
                  pick.teamNumber === USER_TEAM
                    ? "border border-yellow-500"
                    : ""
                }`}
              >
                <div className="text-xs font-medium text-gray-400">
                  {pickNumber}
                </div>
                <div className="text-sm text-white text-center font-semibold">
                  {teamNames[pick.teamNumber - 1]}
                </div>
                <div className="text-xs text-gray-400 w-full text-center h-6 flex items-center justify-center">
                  {pick.player ? pick.player.name : "\u00A0"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
