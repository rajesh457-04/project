import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/carousel';
import './ImageCarousel.css';

const ImageCarousel = () => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item">
          <img src="/images/himalyas.jpg" className="d-block w-100" alt="Sea Link" />
          <div className="carousel-caption d-none d-md-block">
            <h3>HIMALAYAS</h3>
          </div>
        </div>
        <div className="carousel-item active">
          <img src="/images/sea-link.jpg" className="d-block w-100" alt="Himalayas" />
          <div className="carousel-caption d-none d-md-block">
            <h3>BANDRA-WARLI SEA LINK</h3>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/images/Varanasi.jpg" className="d-block w-100" alt="Varanasi" />
          <div className="carousel-caption d-none d-md-block">
            <h3>VARANASI</h3>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next custom-carousel-control" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default ImageCarousel;
