import React, { useEffect, useState } from "react";
import "./MemoryGame.css";

export default function DogMemoryGame() {
  const [level, setLevel] = useState("easy"); // easy=4x4, hard=5x5
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [win, setWin] = useState(false);

  // Pobieranie obrazków i tworzenie kart w zależności od poziomu
  useEffect(() => {
    async function fetchDogs() {
      const count = level === "easy" ? 8 : 12; // 8 par lub 12 par
      const urls = [];

      for (let i = 0; i < count; i++) {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await res.json();
        urls.push(data.message);
      }

      let duplicated = [...urls, ...urls].map((url, index) => ({
        id: index,
        url,
        matched: false,
      }));

      // Dla poziomu hard (5x5) - dodaj pustą kartę, aby było 25 kart (5x5)
      if (level === "hard") {
        duplicated.push({ id: duplicated.length, url: null, matched: true, isEmpty: true });
      }

      // Mieszamy karty
      duplicated = duplicated.sort(() => Math.random() - 0.5);

      setCards(duplicated);
      setFlipped([]);
      setMatched([]);
      setWin(false);
    }
    fetchDogs();
  }, [level]);

  function handleClick(index) {
    if (flipped.length === 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(index)) return;
    if (cards[index].isEmpty) return; // pustej nie klikamy

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (cards[first].url === cards[second].url) {
        setMatched((prev) => [...prev, first, second]);
      }

      setTimeout(() => setFlipped([]), 1000);
    }
  }

  useEffect(() => {
    const pairsToMatch = level === "easy" ? 8 : 12;
    if (matched.length === pairsToMatch * 2) {
      setWin(true);
    }
  }, [matched, level]);

  function resetGame() {
    setLevel(level); // trigger useEffect fetch again
  }

  return (
    <div className="memory-container">
      <h1>Memory Game – Pary Psów 🐶</h1>

      <div style={{ marginBottom: 20 }}>
        <label>
          Poziom:{" "}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="easy">Łatwy (4x4)</option>
            <option value="hard">Trudny (5x5)</option>
          </select>
        </label>
      </div>

      {win && (
        <div style={{ backgroundColor: "#4caf50", color: "white", padding: 15, marginBottom: 20, borderRadius: 8 }}>
          <strong>Gratulacje! Wygrałeś! 🎉</strong>
          <br />
          <button onClick={resetGame} style={{ marginTop: 10, padding: "6px 12px", cursor: "pointer" }}>
            Zagraj ponownie
          </button>
        </div>
      )}

      {!win && <div style={{ marginBottom: 20 }}>Gra działa! Znajdź pary psów 🐕</div>}

      <div className={`grid ${level === "hard" ? "grid-5" : ""}`}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? "flipped" : ""} ${card.isEmpty ? "empty" : ""}`}
              onClick={() => handleClick(index)}
            >
              {isFlipped && card.url ? (
                <img src={card.url} alt="dog" />
              ) : (
                <div className="back" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}