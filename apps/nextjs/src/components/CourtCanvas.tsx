import { useRef, useState } from "react";
import { classnames } from "@/utils/classnames";
import { Dribbble } from "lucide-react";

export type CourtCanvasProps = {
  hasPinnedBall: boolean;
  setHasPinnedBall: (value: boolean) => void;
};

export const CourtCanvas = ({
  hasPinnedBall,
  setHasPinnedBall,
}: CourtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: -50, y: -50 });

  function handlePosition({ x, y }: { x: number; y: number }) {
    if (!canvasRef.current) return;
    setHasPinnedBall(true);

    const canvas = canvasRef.current.getBoundingClientRect();
    setPosition({
      x: x - canvas.x,
      y: y - canvas.y,
    });
  }

  function handleMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDragging) return;
    handlePosition({ x: e.clientX, y: e.clientY });
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setIsDragging(false);
    handlePosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <div
      className={classnames({
        "relative mb-4 w-full overflow-hidden": true,
        "cursor-pointer": !isDragging,
        "cursor-move": isDragging,
      })}
    >
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 p-px"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
      >
        <Dribbble className="h-8 w-8 fill-zinc-950 stroke-white stroke-[1.5] lg:h-10 lg:w-10" />
      </span>
      {!hasPinnedBall ? (
        <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 text-center">
          Clique na quadra para marcar
          <br />a posição do ponto
        </span>
      ) : null}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMove}
        onClick={handleClick}
        onMouseDown={() => setIsDragging(true)}
        className="absolute inset-0 h-full w-full"
      ></canvas>
      <svg
        className={classnames({
          "w-full transition": true,
          "text-zinc-300": !isDragging,
          "text-zinc-500": isDragging,
        })}
        viewBox="0 0 120 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd">
          <rect fill="#09090b" width="120" height="180" rx="4"></rect>
          <path
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
            d="M4 4h112v172H4z"
          ></path>
          <line
            stroke="currentColor"
            strokeWidth="1"
            x1="4"
            y1="90"
            x2="116"
            y2="90"
          />
          <line
            stroke="currentColor"
            strokeWidth="1"
            x1="4"
            y1="18"
            x2="116"
            y2="18"
          />
          <text
            x="60"
            y="14"
            fill="currentColor"
            className="-translate-x-[8px] text-[8px]"
          >
            REDE
          </text>
        </g>
      </svg>
    </div>
  );
};
