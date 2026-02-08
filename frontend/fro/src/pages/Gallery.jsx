import React, { useState } from "react";

const Gallery = () => {
  const images = [
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.22.jpeg",
    "/assets/img/asd1.jpg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.21.jpeg",
    "/assets/img/med.jpg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.23 (1).jpeg",
    "/assets/img/inj.jpg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.23.jpeg",
    "/assets/img/ect.jpg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.24.jpeg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.28.jpeg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.29.jpeg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.27 (1).jpeg",
    "/assets/img/WhatsApp Image 2025-12-19 at 15.53.26.jpeg",
    "/assets/img/back2.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {/* Inline styles for the gallery */}
      <style jsx>{`
        .gallery {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .gallery-heading {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1f2937; /* Tailwind Gray-800 */
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .gallery-item {
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 1;
          background: #f0f0f0;
          transition: transform 0.2s;
        }

        .gallery-item:hover {
          transform: scale(1.03);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .lightbox-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 30px;
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          cursor: pointer;
          z-index: 1001;
        }
      `}</style>

      <div className="gallery">
        {/* ✅ Heading */}
        <h2 className="gallery-heading">Our Product Gallery</h2>

        <div className="gallery-grid">
          {images.map((src, index) => (
            <div
              key={index}
              className="gallery-item"
              onClick={() => setSelectedImage(src)}
            >
              <img src={src} alt={`Gallery item ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="lightbox-image"
            />
            <button
              className="lightbox-close"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
