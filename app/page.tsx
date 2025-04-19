"use client";
import { useEffect, useRef, useState } from "react";

// Utility to get a random integer in [min, max]
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// TODO: Replace with actual count from server or config
const PUZZLE_COUNT = 1396;

const word = "";
const rowHints: string[] = [];
const colHints: string[] = [];

type Cell = {
  letter: string;
};

const initialGrid: Cell[][] = [];

export default function Crossword() {
  const [puzzle, setPuzzle] = useState<{ n: number; m: number; string: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [active, setActive] = useState<[number, number]>([0, 0]);
  const [direction, setDirection] = useState<"row" | "col">("row");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const puzzleId = getRandomInt(0, PUZZLE_COUNT - 1);
    fetch(`http://localhost:5001/puzzle?puzzleId=${puzzleId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Puzzle not found");
        return res.json();
      })
      .then((data) => {
        setPuzzle(data);
        // Parse grid from string
        const n = data.n;
        const s = data.string;
        const newGrid: Cell[][] = [];
        for (let r = 0; r < n; r++) {
          const row: Cell[] = [];
          for (let c = 0; c < n; c++) {
            row.push({ letter: s[r * n + c] });
          }
          newGrid.push(row);
        }
        setGrid(newGrid);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [row, col] = active;
      if (!grid.length) return;
      if (e.key.length === 1 && /^[A-Za-z]$/.test(e.key)) {
        const letter = e.key.toUpperCase();
        setGrid((prev) => {
          const copy = prev.map((r) => r.slice());
          copy[row][col] = { letter };
          return copy;
        });
        // Move cursor
        if (direction === "row" && col < grid[0].length - 1) setActive([row, col + 1]);
        else if (direction === "col" && row < grid.length - 1) setActive([row + 1, col]);
      } else if (e.key === "Backspace") {
        setGrid((prev) => {
          const copy = prev.map((r) => r.slice());
          copy[row][col] = { letter: "" };
          return copy;
        });
        // Move cursor back
        if (direction === "row" && col > 0) setActive([row, col - 1]);
        else if (direction === "col" && row > 0) setActive([row - 1, col]);
      } else if (e.key === "ArrowRight" && col < grid[0].length - 1) setActive([row, col + 1]);
      else if (e.key === "ArrowLeft" && col > 0) setActive([row, col - 1]);
      else if (e.key === "ArrowDown" && row < grid.length - 1) setActive([row + 1, col]);
      else if (e.key === "ArrowUp" && row > 0) setActive([row - 1, col]);
      else if (e.key === "Tab") setDirection((prev) => (prev === "row" ? "col" : "row"));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, grid, direction]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!puzzle || !grid.length) return <div>No puzzle found.</div>;

  return (
    <div>
      <h2>Random Crossword Puzzle</h2>
      <div>Dimensions: {puzzle.n} x {puzzle.m}</div>
      <div style={{ fontFamily: 'monospace', margin: '10px 0' }}>{puzzle.string}</div>
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="absolute top-4 right-4">
          <button
            className="px-3 py-1 text-sm font-medium border rounded bg-white text-black dark:bg-black dark:text-white dark:border-white border-black transition"
            onClick={() => {
              const html = document.documentElement;
              html.classList.toggle("dark");
            }}
          >
            Toggle Theme
          </button>
        </div>
        <div className="flex flex-row gap-8 items-center">
          <div
            className="grid w-[60vmin] h-[60vmin]"
            style={{
              gridTemplateColumns: `repeat(${puzzle.n}, 1fr)`,
              gridTemplateRows: `repeat(${puzzle.n}, 1fr)`,
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

                let background = "var(--cell-bg)";
                if (isActive) background = "var(--cell-active)";
                else if (isHighlight) background = "var(--cell-highlight)";

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
                    className="flex relative justify-center items-center"
                    style={{
                      backgroundColor: background,
                      border: "2px solid var(--cell-border)",
                      fontSize: `calc(40vmin/${puzzle.n})`,
                      fontWeight: "bold",
                      userSelect: "none",
                      aspectRatio: "1",
                      color: "var(--cell-text)",
                    }}
                  >
                    {showNumber && (
                      <div
                        style={{
                          position: "absolute",
                          fontSize: "18px",
                          top: "2px",
                          left: "4px",
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
          <div className="flex flex-col text-sm leading-relaxed max-h-[90vmin] overflow-y-auto">
            <div className="font-bold mb-2">Across</div>
            {rowHints.map((hint, i) => (
              <div key={i}>{`${i + 1}. ${hint}`}</div>
            ))}

            <div className="font-bold mt-4 mb-2">Down</div>
            {colHints.map((hint, i) => (
              <div key={i}>{`${i + 1}. ${hint}`}</div>
            ))}
          </div>
          <input ref={inputRef} style={{ position: "absolute", opacity: 0 }} />
        </div>
      </div>
    </div>
  );
}
