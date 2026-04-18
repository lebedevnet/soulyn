type AvatarProps = {
  name: string;
  seed?: string;
  size?: number;
  className?: string;
  showStatus?: boolean;
};

const GRADIENTS = [
  ["#a78bfa", "#f472b6"],
  ["#60a5fa", "#a78bfa"],
  ["#34d399", "#60a5fa"],
  ["#f472b6", "#fb923c"],
  ["#facc15", "#f472b6"],
  ["#22d3ee", "#a78bfa"],
  ["#fb7185", "#a78bfa"],
  ["#4ade80", "#22d3ee"],
];

function hashCode(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getInitials(name: string) {
  if (!name) {
    return "·";
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");
  return initials || name.charAt(0).toUpperCase();
}

export default function Avatar({
  name,
  seed,
  size = 48,
  className = "",
  showStatus = false,
}: AvatarProps) {
  const gradient = GRADIENTS[hashCode(seed ?? name) % GRADIENTS.length];
  const initials = getInitials(name);
  const fontSize = Math.max(12, Math.round(size * 0.38));

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-black/80 ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        fontSize,
        letterSpacing: "0.02em",
      }}
      aria-hidden
    >
      <span style={{ mixBlendMode: "multiply" }}>{initials}</span>
      {showStatus ? (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 bg-emerald-400"
          style={{
            width: Math.max(10, Math.round(size * 0.22)),
            height: Math.max(10, Math.round(size * 0.22)),
            borderColor: "#07070a",
          }}
        />
      ) : null}
    </div>
  );
}
