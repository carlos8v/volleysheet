import { useEffect, useRef, useState } from "react";

let width = 0;
let height = 0;

const defaultYUnit = 10;

const maxYUnitLabels = 5;

const textTopPadding = 4;
const textBottomPadding = 10;
const textRightPadding = 6;
const textLeftPadding = 10;

const topPadding = 20;
const bottomPadding = 30;
const leftPadding = 40;
const rightPadding = 20;

const backgroundColor = "#09090b";
const guideColor = "#52525b";
const pointColor = "#22c55e";

type PointPosition = {
  x: number;
  y: number;
};

const drawPoint = (
  ctx: CanvasRenderingContext2D,
  point: PointPosition,
  color = pointColor,
) => {
  ctx.strokeStyle = color;
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.arc(point.x + leftPadding, point.y - bottomPadding, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x + leftPadding, point.y - bottomPadding, 4, 0, Math.PI * 2);
  ctx.fill();
};

const drawCurve = (
  ctx: CanvasRenderingContext2D,
  p1: PointPosition,
  p2: PointPosition,
) => {
  const middle = { x: (p2.x + p1.x) / 2, y: (p2.y + p1.y) / 2 };
  const a1 = {
    x: middle.x,
    y: p1.y,
  };
  const a2 = {
    x: middle.x,
    y: p2.y,
  };

  ctx.strokeStyle = pointColor;
  ctx.beginPath();
  ctx.moveTo(p1.x + leftPadding, p1.y - bottomPadding);
  ctx.bezierCurveTo(
    a1.x + leftPadding,
    a1.y - bottomPadding,
    a2.x + leftPadding,
    a2.y - bottomPadding,
    p2.x + leftPadding,
    p2.y - bottomPadding,
  );
  ctx.stroke();

  // Draw shadow
  const [xMin, xMax] = p1.x <= p2.x ? [p1.x, p2.x] : [p2.x, p1.x];

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, `${pointColor}44`);
  grad.addColorStop(1, `${pointColor}0f`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(p1.x + leftPadding, p1.y - bottomPadding);
  ctx.bezierCurveTo(
    a1.x + leftPadding,
    a1.y - bottomPadding,
    a2.x + leftPadding,
    a2.y - bottomPadding,
    p2.x + leftPadding,
    p2.y - bottomPadding,
  );
  ctx.lineTo(xMax + leftPadding, height - bottomPadding);
  ctx.lineTo(xMin + leftPadding, height - bottomPadding);
  ctx.closePath();
  ctx.fill();
};

const draw = (canvas: HTMLCanvasElement, points: number[]) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  height = canvas.height;
  width = canvas.width;

  // Clear screen
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = guideColor;
  ctx.lineWidth = 1;

  // Draw graph line
  ctx.beginPath();
  ctx.moveTo(leftPadding, height - bottomPadding);
  ctx.lineTo(width - rightPadding, height - bottomPadding);
  ctx.stroke();

  // Draw graph units
  const highestYUnit = Math.max(...points, defaultYUnit);
  const rest = highestYUnit % 10;
  const maxUnit = highestYUnit + (rest ? 10 - rest : 0);

  const xUnitPadding =
    (width - leftPadding - rightPadding) / (points.length - 1);
  const yUnitPadding = (height - topPadding - bottomPadding) / maxYUnitLabels;
  const yAxisUnitLabel = maxUnit / maxYUnitLabels;

  for (let i = 0; i <= maxYUnitLabels; i++) {
    ctx.strokeStyle = guideColor;
    ctx.strokeText(
      `${Math.ceil(yAxisUnitLabel * i)}`,
      textLeftPadding,
      height - bottomPadding - i * yUnitPadding + textTopPadding,
    );

    // Draw guide lines
    if (i >= 1) {
      ctx.strokeStyle = `${guideColor}88`;
      ctx.beginPath();
      ctx.moveTo(leftPadding, height - bottomPadding - i * yUnitPadding);
      ctx.lineTo(
        width - rightPadding,
        height - bottomPadding - i * yUnitPadding,
      );
      ctx.stroke();
    }
  }

  ctx.strokeStyle = guideColor;

  for (let i = 0; i < xUnitPadding; i++) {
    ctx.strokeText(
      `W${i + 1}`,
      leftPadding + xUnitPadding * i - textRightPadding,
      height - textBottomPadding,
    );
  }

  const xPointPadding = (height - topPadding - bottomPadding) / maxUnit;
  const pointsPositions = points.map((point, idx) => ({
    x: idx * xUnitPadding,
    y: height - point * xPointPadding,
  }));

  for (let i = 0; i < pointsPositions.length; i += 1) {
    if (pointsPositions[i + 1]) {
      drawCurve(ctx, pointsPositions[i]!, pointsPositions[i + 1]!);
    }

    drawPoint(ctx, pointsPositions[i]!);
  }
};

type PlayerScoreChartProps = {
  points: number[];
};

export const PlayerScoreChart = ({ points }: PlayerScoreChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    getCanvasDimensions();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getCanvasDimensions);

    return () => {
      window.removeEventListener("resize", getCanvasDimensions);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      getCanvasDimensions();
    }
  }, [canvasRef]);

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current, points ?? [0, 0, 0, 0]);
    }
  }, [canvasWidth, canvasHeight, points]);

  function getCanvasDimensions() {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasHeight(rect.height);
      setCanvasWidth(rect.width);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-[174px] w-full rounded-sm"
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};
