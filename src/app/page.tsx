"use client";

import { useState } from "react";
import DraftTopBar, { AllPicks } from "./components/DraftTopBar";
import PlayerList from "./components/PlayerList";
import TeamRoster from "./components/TeamRoster";
import PlayerQueue from "./components/PlayerQueue";
import {
  players,
  NUM_TEAMS,
  NUM_ROUNDS,
  USER_TEAM,
  teamNames,
} from "./data/constants";

interface Player {
  name: string;
  position: string;
  team: string;
  opponent: string;
}

export default function FantasyDraft() {
  const [currentPick, setCurrentPick] = useState(1);
  const [availablePlayers, setAvailablePlayers] = useState(players);
  const [teamRosters, setTeamRosters] = useState<{ [key: number]: Player[] }>({
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [isDraftOver, setIsDraftOver] = useState(false);
  const [playerQueue, setPlayerQueue] = useState<Player[]>([]);

  const currentTeam =
    Math.floor((currentPick - 1) / NUM_TEAMS) % 2 === 0
      ? ((currentPick - 1) % NUM_TEAMS) + 1
      : NUM_TEAMS - ((currentPick - 1) % NUM_TEAMS);

  const handleDraft = (player: Player) => {
    if (isDraftOver) return;

    setTeamRosters((prevRosters) => ({
      ...prevRosters,
      [currentTeam]: [...prevRosters[currentTeam], player],
    }));

    setAvailablePlayers((prevPlayers) =>
      prevPlayers.filter((p) => p.name !== player.name)
    );

    const nextPick = currentPick + 1;
    setCurrentPick(nextPick);

    if (nextPick > NUM_TEAMS * NUM_ROUNDS) {
      setIsDraftOver(true);
    }
  };

  const handleAutoDraft = () => {
    while (!isDraftOver) {
      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      handleDraft(availablePlayers[randomIndex]);
    }
  };

  const getTeamPlayers = (teamNumber: number) => {
    return teamRosters[teamNumber] || [];
  };

  const allPicks = Array.from(
    { length: NUM_TEAMS * NUM_ROUNDS },
    (_, index) => {
      const pickNumber = index + 1;
      const round = Math.ceil(pickNumber / NUM_TEAMS);
      const teamNumber =
        round % 2 === 1
          ? ((pickNumber - 1) % NUM_TEAMS) + 1
          : NUM_TEAMS - ((pickNumber - 1) % NUM_TEAMS);
      const player =
        teamRosters[teamNumber][Math.floor((pickNumber - 1) / NUM_TEAMS)] ||
        null;
      return {
        teamNumber,
        player,
      };
    }
  );

  const addToQueue = (player: Player) => {
    setPlayerQueue((prevQueue) => [...prevQueue, player]);
  };

  const removeFromQueue = (player: Player) => {
    setPlayerQueue((prevQueue) =>
      prevQueue.filter((p) => p.name !== player.name)
    );
  };

  const updateQueue = (newQueue: Player[]) => {
    setPlayerQueue(newQueue);
  };

  return (
    <div className="min-h-screen bg-base-300 text-base-content p-4">
      <DraftTopBar
        allPicks={allPicks}
        currentPick={currentPick}
        currentTeam={currentTeam}
        teamNames={teamNames}
        isDraftOver={isDraftOver}
        handleAutoDraft={handleAutoDraft}
        USER_TEAM={USER_TEAM}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <PlayerList
            availablePlayers={availablePlayers}
            isDraftOver={isDraftOver}
            handleDraft={handleDraft}
            addToQueue={addToQueue}
            removeFromQueue={removeFromQueue}
            queuedPlayers={playerQueue}
          />
        </div>
        <div>
          <PlayerQueue
            queue={playerQueue}
            removeFromQueue={removeFromQueue}
            handleDraft={handleDraft}
            isDraftOver={isDraftOver}
            updateQueue={updateQueue}
          />
        </div>
        <div>
          <TeamRoster teamNames={teamNames} getTeamPlayers={getTeamPlayers} />
        </div>
      </div>
    </div>
  );
}
