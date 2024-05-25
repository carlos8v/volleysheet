import { classnames } from "@/utils/classnames";

const dX = 5;
const dY = 5;
const mX = 100;
const mY = 100;

interface HexagonPoint {
  x: number;
  y: number;
  angle: number;
}

const hexagonPoints: HexagonPoint[] = [
  {
    x: 100,
    y: 0,
    angle: 90,
  },
  {
    x: 186.5,
    y: 50,
    angle: 30,
  },
  {
    x: 186.5,
    y: 150,
    angle: -30,
  },
  {
    x: 100,
    y: 200,
    angle: -90,
  },
  {
    x: 13.5,
    y: 150,
    angle: -150,
  },
  {
    x: 13.5,
    y: 50,
    angle: 150,
  },
];

function calculateH(x: number, y: number) {
  return Math.sqrt(x ** 2 + y ** 2);
}

function convertToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

function calculatePoint({ x, y, angle }: HexagonPoint, level: number) {
  const dX = x - mX;
  const dY = y - mY;
  const h = calculateH(dX, dY);

  const hPoints = 5;
  const aH = h / hPoints;

  const safeLevel = Math.max(Math.min(level, 5), 0);
  const aX = Math.cos(convertToRad(angle)) * (aH * safeLevel);
  const aY = Math.sin(convertToRad(angle)) * (aH * safeLevel);

  return { aX, aY };
}

function Polygon({
  levels,
  guideline = false,
}: {
  levels: [number, number, number, number, number, number];
  guideline?: boolean;
}) {
  const paths = [];

  for (let idx = 0; idx <= 5; idx += 1) {
    paths.push(calculatePoint(hexagonPoints[idx]!, levels[idx]!));
  }

  return (
    <polygon
      points={paths
        .map(({ aX, aY }) => `${mX + aX + dX},${mY - aY + dY}`)
        .join(", ")}
      opacity="1"
      fill={guideline ? "transparent" : "rgba(70, 194, 82, 0.25)"}
      stroke={guideline ? "#18181b" : "rgb(70, 194, 82)"}
    ></polygon>
  );
}

function Badge({ level }: { level: number }) {
  return (
    <span
      className={classnames({
        "ml-1 block flex items-center justify-center rounded px-1.5": true,
        "bg-zinc-800 text-white": level === 0,
        "bg-red-500 text-black": level === 1,
        "bg-orange-500 text-black": level === 2,
        "bg-yellow-500 text-black": level === 3,
        "bg-green-500 text-black": level === 4,
        "bg-green-400 text-black": level === 5,
      })}
    >
      {level}
    </span>
  );
}

interface PlayerStatsProps {
  stamina: number;
  attack: number;
  block: number;
  defence: number;
  set: number;
  serve: number;
  score: number;
}

const ranks = [
  { min: 5, label: "Rank E" },
  { min: 10, label: "Rank D" },
  { min: 15, label: "Rank C" },
  { min: 20, label: "Rank B" },
  { min: 25, label: "Rank A" },
  { min: 30, label: "Rank S" },
];

export const PlayerStats = ({
  attack = 0,
  defence = 0,
  serve = 0,
  stamina = 0,
  set = 0,
  block = 0,
  score,
}: PlayerStatsProps) => {
  function getRank() {
    return (
      ranks.reduce((acc, rank) => (score >= rank.min ? rank : acc), ranks[0])
        ?.label ?? "Não classificado"
    );
  }

  return (
    <div className="w-full px-4 pb-8 pt-3 md:max-w-[500px]">
      <div className="mb-8">
        <p className="text-sm font-medium">Visão geral sobre atributos</p>
        <small className="font-medium text-zinc-400">{getRank()}</small>
      </div>
      <div className="relative mx-auto block w-fit px-10 py-4">
        <div
          title="Ataque"
          className="absolute left-1/2 top-0 flex h-fit -translate-x-2/4 -translate-y-2/4 select-none items-center text-sm font-medium text-zinc-400"
        >
          ATT
          <Badge level={attack} />
        </div>
        <div
          title="Passe"
          className="absolute right-0 top-1/4 flex translate-x-1 select-none items-center text-sm font-medium text-zinc-400"
        >
          PAS
          <Badge level={defence} />
        </div>
        <div
          title="Saque"
          className="absolute bottom-1/4 right-0 flex translate-x-1.5 select-none items-center text-sm font-medium text-zinc-400"
        >
          SAQ
          <Badge level={serve} />
        </div>
        <div
          title="Estamina"
          className="absolute bottom-0 left-1/2 flex h-fit -translate-x-2/4 translate-y-2/4 select-none items-center text-sm font-medium text-zinc-400"
        >
          EST
          <Badge level={stamina} />
        </div>
        <div
          title="Levantamento"
          className="absolute bottom-1/4 left-0 flex -translate-x-1.5 select-none items-center text-sm font-medium text-zinc-400"
        >
          LEV
          <Badge level={set} />
        </div>
        <div
          title="Bloqueio"
          className="absolute left-0 top-1/4 flex -translate-x-1.5 select-none items-center text-sm font-medium text-zinc-400"
        >
          BLO
          <Badge level={block} />
        </div>
        <div className="h-[200px] w-[200px]">
          <svg height="100%" width="100%" viewBox="0 0 210 210" strokeWidth="2">
            <polygon
              fill="#09090b"
              points={hexagonPoints
                .map(({ x, y }) => `${x + dX},${y + dY}`)
                .join(", ")}
            ></polygon>
            <Polygon guideline levels={[1, 1, 1, 1, 1, 1]} />
            <Polygon guideline levels={[2, 2, 2, 2, 2, 2]} />
            <Polygon guideline levels={[3, 3, 3, 3, 3, 3]} />
            <Polygon guideline levels={[4, 4, 4, 4, 4, 4]} />
            <Polygon levels={[attack, defence, serve, stamina, set, block]} />
          </svg>
        </div>
      </div>
    </div>
  );
};
