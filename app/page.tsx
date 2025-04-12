"use client";
import { useEffect, useRef, useState } from "react";

const BLUE_HIGHLIGHT = "";

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
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex justify-center items-center h-screen gap-8">
        <div className="grid w-[90vmin] h-[90vmin]"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const [activeRow, activeCol] = active;
              const isActive = r === activeRow && c === activeCol;
              const isHighlight =
                direction === "row" ? r === activeRow : c === activeCol;
              const showNumber = r == 0 || c == 0;

              let bgColor = "#fff";
              if (isActive) bgColor = "#ffcc66"; // orange/yellow
              else if (isHighlight) bgColor = "#b3d7ff"; // light blue

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
                  className="flex relative justify-center, items-center"
                  style={{
                    backgroundColor: bgColor,
                    border: "2px solid #aaa",
                    fontSize: "8vmin",
                    fontWeight: "bold",
                    userSelect: "none",
                    aspectRatio: "1",
                    color: "#000", // always render letters in black
                  }}
                >
                  {showNumber && (
                    <div
                      style={{
                        position: "absolute",
                        fontSize: "25px",
                        top: "2px",
                        left: "4px"
                      }}
                    >
                      {r == 0 ? c + 1 : r + 1}
                    </div>
                  )}
                  {cell.letter}
                </div>
              );
            })
          )}
        </div>
        <div className="flex flex-col max-w-[20vw] text-sm leading-relaxed overflow-y-auto">
          <div className="font-bold mb-2">Across</div>
          {rowHints.map((hint, i) => (
            <div key={i}>{`${i + 1}. ${hint}`}</div>
          ))}

          <div className="font-bold mt-4 mb-2">Down</div>
          {colHints.map((hint, i) => (
            <div key={i}>{`${i + 1}. ${hint}`}</div>
          ))}
        </div>
      </div>
      <input ref={inputRef} style={{ position: "absolute", opacity: 0 }} />
    </div>
  );
}
