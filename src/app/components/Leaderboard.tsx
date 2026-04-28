import { Card } from './ui/card';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  tasksCompleted?: number;
  hours?: number;
  issuesResolved?: number;
  volunteers?: number;
}

interface LeaderboardProps {
  title: string;
  entries: LeaderboardEntry[];
  type: 'volunteer' | 'ngo';
}

export default function Leaderboard({ title, entries, type }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm font-semibold text-gray-600">#{rank}</span>;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-3 rounded-lg ${
              entry.rank <= 3 ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="w-8 flex items-center justify-center">
              {getRankIcon(entry.rank)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{entry.name}</p>
              <p className="text-sm text-gray-600">
                {type === 'volunteer' ? (
                  <>
                    {entry.tasksCompleted} tasks • {entry.hours} hours
                  </>
                ) : (
                  <>
                    {entry.issuesResolved} issues • {entry.volunteers} volunteers
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
