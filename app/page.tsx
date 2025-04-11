"use client";
import { useState } from "react";

const word = "AWARDTHREELOOSEARMEDSEATS";
const size = 5;

export default function Home() {
  // Initialize grid as a 2D array of characters
  const initialGrid = Array.from({ length: size }, (_, row) =>
    word.slice(row * size, (row + 1) * size).split("")
  );

  const [grid, setGrid] = useState(initialGrid);

  // Handle typing into a cell
  const handleChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return; // limit to one char
    const newGrid = [...grid.map(row => [...row])]; // deep clone
    newGrid[row][col] = value.toUpperCase(); // keep uppercase
    setGrid(newGrid);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
        width: "90vmin",
        height: "90vmin",
        maxWidth: "90vw",
        maxHeight: "90vh",
        margin: "auto",
        gap: "0.5vmin",
        padding: "1vmin",
        boxSizing: "border-box",
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((char, colIndex) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            value={char}
            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
            maxLength={1}
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "5vmin",
              fontFamily: "Arial, sans-serif",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              aspectRatio: "1 / 1",
              width: "100%",
              height: "100%",
            }}
          />
        ))
      )}
    </div>
  );
}
