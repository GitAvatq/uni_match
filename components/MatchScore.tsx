export function MatchScore({ score, size = 92 }: { score: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped > 85 ? "#22c55e" : clamped >= 70 ? "#2563eb" : clamped >= 55 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} aria-label={`${clamped}% match`}>
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(148,163,184,.18)" strokeWidth="8" />
        <circle className="animate-ring" cx="50" cy="50" r={radius} fill="none" stroke={color} strokeLinecap="round" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <span className="absolute text-lg font-black">{clamped}%</span>
    </div>
  );
}

export function ScoreGauge({ score }: { score: number }) {
  return <MatchScore score={score} size={132} />;
}
