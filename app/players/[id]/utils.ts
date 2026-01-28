export const Attackingfields = [
  { label: "Offensive Awareness", key: "OffensiveAwareness" },
  { label: "Ball Control", key: "BallControl" },
  { label: "Dribbling", key: "Dribbling" },
  { label: "Tight Possession", key: "TightPossession" },
  { label: "Low Pass", key: "LowPass" },
  { label: "Lofted Pass", key: "LoftedPass" },
  { label: "Finishing", key: "Finishing" },
  { label: "Heading", key: "Heading" },
  { label: "Place Kicking", key: "PlaceKicking" },
  { label: "Curl", key: "Curl" },
];

export const Defendingfields = [
  { label: "Defensive Awareness", key: "DefensiveAwareness" },
  { label: "Defensive Engagement", key: "DefensiveEngagement" },
  { label: "Tackling", key: "BallWinning" },
  { label: "Aggression", key: "Aggression" },
  { label: "GK Awareness", key: "GKAwareness" },
  { label: "Gk Catching", key: "GKCatching" },
  { label: "GK Parrying", key: "GKClearing" },
  { label: "GK Reflexes", key: "GKReflexes" },
  { label: "GK Reach", key: "GKReach" },
];

export const Athleticismfields = [
  { label: "Speed", key: "Speed" },
  { label: "Acceleration", key: "Acceleration" },
  { label: "Kicking Power", key: "KickingPower" },
  { label: "Jump", key: "Jump" },
  { label: "Physical Contact", key: "PhysicalContact" },
  { label: "Balance", key: "Balance" },
  { label: "Stamina", key: "Stamina" },
];

export const fieldColor = (value: number) => {
  switch (true) {
    case value > 30 && value <= 60:
      return "bg-red-400!";
    case value <= 80 && value > 60:
      return "bg-yellow-500!";
    case value <= 90 && value > 80:
      return "bg-green-400!";
    case value > 90:
      return "bg-cyan-400!";
    default:
      return "bg-red-400";
  }
};

export const conditionColors = (
  condition: string | number | null | undefined,
) => {
  switch (Number(condition)) {
    case 0:
      return "text-red-400";
    case 1:
      return "text-orange-400";
    case 2:
      return "text-yellow-400";
    case 3:
      return "text-lime-400";
    case 4:
      return "text-green-400";
    default:
      return "text-red-400";
  }
};

export function scaleBy20(value: number): number {
  return Math.min(4, Math.floor((value - 40) / 20));
}
