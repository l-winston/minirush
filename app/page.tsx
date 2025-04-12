"use client";
import { useEffect, useRef, useState } from "react";

const word = "BEATSORBITAROMAROVERDRESS";
const rowHints = [
  "Rhythmic pulses in music",
  "Path of a planet around the sun",
  "Pleasant smell",
  "Mars explorer",
  "One-piece outfit",
];
const colHints = [
  "Flat surface or a group of directors",
  "Mistake or bug",
  "Higher than",
  "Multiplies, or a newspaper",
  "Night sky lights or celebrities",
];
const size = 5;

type Cell = {
  letter: string;
};

const initialGrid: Cell[][] = Array.from({ length: size }, () =>
  Array.from({ length: size }, () => ({ letter: "" }))
);

export default function Crossword() {
  const [grid, setGrid] = useState(initialGrid);
  const [active, setActive] = useState<[number, number]>([0, 0]);
  const [direction, setDirection] = useState<"row" | "col">("row");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [row, col] = active;

      const move = (r: number, c: number) => {
        if (r >= 0 && r < size && c >= 0 && c < size) {
          setActive([r, c]);
        }
      };

      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));
        newGrid[row][col].letter = e.key.toUpperCase();
        setGrid(newGrid);
        direction === "row" ? move(row, col + 1) : move(row + 1, col);
      } else if (e.key === "Backspace") {
        const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));
        newGrid[row][col].letter = "";
        setGrid(newGrid);
        direction === "row" ? move(row, col - 1) : move(row - 1, col);
      } else if (e.key === "ArrowUp") move(row - 1, col);
      else if (e.key === "ArrowDown") move(row + 1, col);
      else if (e.key === "ArrowLeft") move(row, col - 1);
      else if (e.key === "ArrowRight") move(row, col + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, grid, direction]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          width: "90vmin",
          height: "90vmin",
          gap: "1px",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const [activeRow, activeCol] = active;
            const isActive = r === activeRow && c === activeCol;
            const isHighlight =
              direction === "row" ? r === activeRow : c === activeCol;

            let bgColor = "#fff";
            if (isActive) bgColor = "#ffcc66"; // orange/yellow
            else if (isHighlight) bgColor = "#e6f2ff"; // light blue

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => {
                  if (isActive) {
                    setDirection((prev) => (prev === "row" ? "col" : "row"));
                  } else {
                    setActive([r, c]);
                  }
                }}
                style={{
                  backgroundColor: bgColor,
                  border: "1px solid #aaa",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "4vmin",
                  fontWeight: "bold",
                  userSelect: "none",
                  aspectRatio: "1",
                  color: "#000", // always render letters in black
                }}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>
      <input ref={inputRef} style={{ position: "absolute", opacity: 0 }} />
    </div>
  );
}
