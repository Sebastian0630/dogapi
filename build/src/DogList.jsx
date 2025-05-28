import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DogMemoryGame from "./DogMemoryGame"

export default function DogList() {
  const [breeds, setBreeds] = useState([]);
  const [images, setImages] = useState({});
  const [showMemoryGame, setShowMemoryGame] = useState(false); // <- stan przełączania

  useEffect(() => {
  async function fetchBreeds() {
    const res = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await res.json();

    // Przekształć obiekt w tablicę ras
    const allBreeds = Object.keys(data.message);
      const shuffled = allBreeds.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      setBreeds(selected);

    // Pomieszaj kolejność ras
    function shuffleArray(array) {
      return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    }

    const shuffledBreeds = shuffleArray(allBreeds);

    // Wybierz np. 10 losowych ras
    const selectedBreeds = shuffledBreeds.slice(0, 21);
    setBreeds(selectedBreeds);

    // Pobierz losowe zdjęcie dla każdej z tych ras
    const imageResponses = await Promise.all(
      selectedBreeds.map((breed) =>
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then((res) =>
          res.json()
        )
      )
    );

    const imagesMap = {};
    selectedBreeds.forEach((breed, index) => {
      imagesMap[breed] = imageResponses[index].message;
    });
    setImages(imagesMap);
  }

  fetchBreeds();
}, []);

if (showMemoryGame) {
    return (
      <div style={{ padding: "2rem" }}>
        <button onClick={() => setShowMemoryGame(false)}>← Wróć do listy ras</button>
        <DogMemoryGame />
      </div>
    );
  }



  if (breeds.length === 0) return <div className="loading">Ładowanie ras psów...</div>;

  return (
    <div className="dog">
      <h1 className="dog__title">Rasy Psów</h1>
      <button onClick={() => setShowMemoryGame(true)} style={{ marginBottom: "1.5rem" }}>
        🎮 Zagraj w Memory
      </button>
      <ul className="dog__list">
        {breeds.map((breed) => (
          <li key={breed} className="dog__item">
            <Link to={`/dog/${breed}`} className="dog__link">
              <div className="dog__card">
                <h2 className="dog__name">{breed}</h2>
                <img
                  className="dog__icon"
                  src={images[breed]}
                  alt={breed}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}