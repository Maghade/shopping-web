


import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderData = [
  {
    id: 1,
    title: "Discovery, Development & Commercialization",
    src: "/assets/img/banner/slide03.jpg",
    description: "DiscoveryOf innovative therapies intended to significantly improve outcomes in patients suffering from life-threatening diseases.",},
  {
    id: 2,
    title: "Committed to Excellence in Patient-Centered Care",
      description: "Delivering world-class therapeutic solutions that enhance quality of life and provide hope for patients worldwide.",

    src: "/assets/img/banner/slide01.jpg",
  },
  //  {
  //   id: 3,
  //   title: "Discovery, Development & Commercialization",
  //   description: "DiscoveryOf innovative therapies intended to significantly improve outcomes in patients suffering from life-threatening diseases.",
  //       src: "assets/img/Phar.jpg"

   
  // },
];

// CSS Animations
const styles = `
  .slide-container {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
  }

  .slide-image {
    width: 100%;
    height: 100%;
    objectFit: cover;
    transition: transform 0.8s ease-out;
  }

  .slide-text {
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -40%) scale(0.9);
    opacity: 0;
    color: #fff;
    padding: 20px 30px;
    borderRadius: 8px;
    textAlign: center;
    maxWidth: 80%;
    fontSize: 1.1rem;
    transition: all 0.6s ease-out;
    animation: fadeInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /* Optional: subtle hover effect */
  .slide-image:hover {
    transform: scale(1.05);
  }
`;

const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,          // ✅ Auto-play enabled
    autoplaySpeed: 3000,     // Every 3 seconds
    fade: true,              // ✅ Fade between slides (smoothest for auto)
    cssEase: "linear",       // Smooth linear transition
    pauseOnHover: true,
    arrows: true,            // Optional: keep arrows for manual control
    adaptiveHeight: false,
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ width: "80%", margin: "0 auto", position: "relative" }}>
        <Slider {...settings}>
          {sliderData.map((slide) => (
            <div key={slide.id} className="slide-container">
              <img
                src={slide.src}
                alt={slide.title}
                className="slide-image"
                style={{
                  transition: "transform 0.8s ease-out",
                }}
              />

              {/* Animated Text */}
              <div
                key={slide.id} // 👈 Forces re-animation on slide change
                className="slide-text"
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "2.4rem",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {slide.title}
                </h3>
                <p
                  style={{
                    margin: "12px 0 20px",
                    lineHeight: 1.6,
                    fontSize: "1.2rem",
                    color: "#fff",
                  }}
                >
                  {slide.description}
                </p>
                <button
                className="site-btn"
               
                >
                  
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default SimpleSlider;
