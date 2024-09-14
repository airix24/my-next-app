import React, { useState } from "react";
import { positions } from "../data/constants";

interface Player {
  name: string;
  position: string;
  team: string;
  opponent: string;
}

interface TeamRosterProps {
  teamNames: string[];
  getTeamPlayers: (teamNumber: number) => Player[];
}

const TeamRoster: React.FC<TeamRosterProps> = ({
  teamNames,
  getTeamPlayers,
}) => {
  const [viewedTeam, setViewedTeam] = useState(1);

  const teamPlayers = getTeamPlayers(viewedTeam);

  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center text-3xl font-bold text-base-content/80">
          {teamNames[viewedTeam - 1][0]}
        </div>
        <select
          className="select select-bordered select-sm"
          value={viewedTeam}
          onChange={(e) => setViewedTeam(Number(e.target.value))}
        >
          {teamNames.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {positions.map((pos) => (
          <div key={pos} className="text-center">
            <div
              className={`text-xs ${
                pos === "QB"
                  ? "text-purple-400"
                  : pos === "RB"
                  ? "text-green-400"
                  : pos === "WR"
                  ? "text-orange-400"
                  : "text-blue-400"
              }`}
            >
              {pos}
            </div>
            <div>
              {teamPlayers.filter((player) => player.position === pos).length}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {positions.map((pos) => (
          <div key={pos}>
            <div className="font-bold mb-1">{pos}</div>
            {teamPlayers
              .filter((player) => player.position === pos)
              .map((player) => (
                <div
                  key={player.name}
                  className={`p-2 rounded flex items-center space-x-2 mb-2 ${
                    pos === "QB"
                      ? "bg-purple-400 text-purple-900"
                      : pos === "RB"
                      ? "bg-green-400 text-green-900"
                      : pos === "WR"
                      ? "bg-orange-400 text-orange-900"
                      : "bg-blue-400 text-blue-900"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-base-100 flex items-center justify-center text-xs font-bold">
                    {player.position}
                  </div>
                  <div>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-xs">
                      {player.team} vs {player.opponent}
                    </div>
                  </div>
                </div>
              ))}
            {teamPlayers.filter((player) => player.position === pos).length ===
              0 && (
              <div className="text-base-content/60 text-sm">
                No players drafted
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRoster;
