import TiltedCard from "../components/rb/TiltedCard";
import { gallery, photo } from "../data";

export default function Gallery() {
  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="display">Faces of the club</h2>
      <ul className="gallery__grid">
        {gallery.map(([name, alt]) => (
          <li key={name}>
            <TiltedCard imageSrc={photo(name)} altText={alt} containerHeight="100%" containerWidth="100%"
              imageHeight="100%" imageWidth="100%" rotateAmplitude={10} scaleOnHover={1.04} showTooltip={false} />
          </li>
        ))}
      </ul>
    </section>
  );
}
