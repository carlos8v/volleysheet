import { classnames } from "@/lib/classnames";

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
}: {
  levels: [number, number, number, number, number, number];
}) {
  const paths = [];

  for (let idx = 0; idx <= 5; idx += 1) {
    paths.push(calculatePoint(hexagonPoints[idx]!, levels[idx]!));
  }

  return (
    <polygon
      points={paths.map(({ aX, aY }) => `${mX + aX},${mY - aY}`).join(", ")}
      opacity="1"
      fill="rgba(70, 194, 82, 0.25)"
      stroke="rgb(70, 194, 82)"
    ></polygon>
  );
}

function Badge({ level }: { level: number }) {
  return (
    <span
      className={classnames({
        "ml-1 block flex items-center justify-center rounded px-1.5": true,
        "bg-zinc-800 text-white": level === 0,
        "bg-red-400 text-black": level === 1,
        "bg-red-500 text-black": level === 2,
        "bg-orange-400 text-black": level === 3,
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
}

export const PlayerStats = ({
  attack,
  defence,
  serve,
  stamina,
  set,
  block,
}: PlayerStatsProps) => {
  return (
    <div className="w-full max-w-[500px] p-4">
      <div className="mb-8">
        <p className="font-medium">Visão geral sobre atributos</p>
      </div>
      <div className="relative mx-auto block w-fit px-10 py-4">
        <div className="absolute left-1/2 top-0 flex h-fit -translate-x-2/4 -translate-y-2/4 select-none items-center text-sm font-medium text-zinc-400">
          ATT
          <Badge level={attack} />
        </div>
        <div className="absolute right-0 top-1/4 flex translate-x-1 select-none items-center text-sm font-medium text-zinc-400">
          PAS
          <Badge level={defence} />
        </div>
        <div className="absolute bottom-1/4 right-0 flex translate-x-1.5 select-none items-center text-sm font-medium text-zinc-400">
          SAQ
          <Badge level={serve} />
        </div>
        <div className="absolute bottom-0 left-1/2 flex h-fit -translate-x-2/4 translate-y-2/4 select-none items-center text-sm font-medium text-zinc-400">
          EST
          <Badge level={stamina} />
        </div>
        <div className="absolute bottom-1/4 left-0 flex -translate-x-1.5 select-none items-center text-sm font-medium text-zinc-400">
          LEV
          <Badge level={set} />
        </div>
        <div className="absolute left-0 top-1/4 flex -translate-x-1.5 select-none items-center text-sm font-medium text-zinc-400">
          BLO
          <Badge level={block} />
        </div>
        <div className="h-[202px] w-[202px]">
          <svg
            height="100%"
            width="100%"
            viewBox="0 0 202 202"
            stroke-width="2"
          >
            <polygon
              fill="var(--foreground)"
              points="100,0 186.5,50 186.65,150, 100,200 13.5,150, 13.5,50"
            ></polygon>
            <Polygon levels={[attack, defence, serve, stamina, set, block]} />
          </svg>
        </div>
      </div>
    </div>
  );
};
