import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DogDetail() {
  const { breedName } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(`https://dog.ceo/api/breed/${breedName}/images`);
      const data = await res.json();
      setImages(data.message.slice(0, 6)); // ogranicz do kilku zdjęć
    }

    fetchImages();
  }, [breedName]);

  if (images.length === 0) return <div className="loading">Ładowanie zdjęć...</div>;

  return (
    <div className="city">
      <h1 className="city__name">{breedName}</h1>
      <div className="city__details">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${breedName}-${index}`}
            style={{ width: "50%", marginBottom: "2rem", borderRadius: "480px" }}
          />
        ))}
      </div>
      <Link to="/" className="city__back">Powrót do listy ras</Link>
    </div>
  );
}