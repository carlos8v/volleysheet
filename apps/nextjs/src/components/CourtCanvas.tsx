import { useRef, useState } from "react";
import { classnames } from "@/utils/classnames";
import { Dribbble } from "lucide-react";

export type CourtCanvasProps = {
  setBallPosition: (value: { x: number; y: number }) => void;
  hasPinnedBall: boolean;
  setHasPinnedBall: (value: boolean) => void;
};

export const CourtCanvas = ({
  setBallPosition,
  hasPinnedBall,
  setHasPinnedBall,
}: CourtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [pinPosition, setPinPosition] = useState({ x: -50, y: -50 });

  function savePosition({ x, y }: { x: number; y: number }) {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current.getBoundingClientRect();
    const pin = {
      x: x - canvas.x,
      y: y - canvas.y,
    };

    setPinPosition(pin);
    setBallPosition({
      x: (pin.x * 100) / canvas.width,
      y: (pin.y * 100) / canvas.height,
    });
  }

  function handleMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDragging) return;
    setHasPinnedBall(false);
    savePosition({ x: e.clientX, y: e.clientY });
  }

  function handlePlacePin(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    savePosition({ x: e.clientX, y: e.clientY });
    setIsDragging(false);
    setHasPinnedBall(true);
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
          top: `${pinPosition.y}px`,
          left: `${pinPosition.x}px`,
        }}
      >
        <Dribbble className="h-8 w-8 fill-zinc-950 stroke-white stroke-[1] lg:h-10 lg:w-10" />
      </span>
      {!hasPinnedBall && !isDragging ? (
        <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 text-center">
          Clique na quadra para marcar
          <br />a posição do ponto
        </span>
      ) : null}
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          // Update pin first position
          setIsDragging(true);
          savePosition({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={handleMove}
        onMouseLeave={(e) => {
          // Drop pin if leave canvas
          if (isDragging) {
            handlePlacePin(e);
          }
        }}
        onClick={handlePlacePin}
        className="absolute inset-0 h-full w-full"
      ></canvas>
      <svg
        className={classnames({
          "w-full transition": true,
          "text-zinc-300": !isDragging,
          "text-zinc-500": isDragging,
        })}
        viewBox="0 0 120 133"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd">
          <rect fill="#09090b" width="120" height="133" rx="2"></rect>
          <path
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="round"
            d="M4 4 h112 v125 H4 z"
          ></path>
          <line
            stroke="currentColor"
            strokeWidth="0.5"
            x1="4"
            y1="56"
            x2="116"
            y2="56"
          />
          <line
            stroke="currentColor"
            strokeWidth="0.5"
            x1="4"
            y1="18"
            x2="116"
            y2="18"
          />
          <text
            x="60"
            y="14"
            fill="currentColor"
            className="-translate-x-[8px] select-none text-[8px]"
          >
            REDE
          </text>
        </g>
      </svg>
    </div>
  );
};
