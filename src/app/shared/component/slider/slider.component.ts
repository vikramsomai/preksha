import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/types/modules';
Swiper.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements AfterViewInit {
  slides = [
    {
      image: 'assets/images/slider/fashion-slideshow-03.jpg',
      alt: 'Fashion Slideshow',
      title: 'Glamorous Glam',
      description: 'From casual to formal, we’ve got you covered',
      cta: 'Shop collection',
    },
    {
      image: 'assets/images/slider/fashion-slideshow-03.jpg',
      alt: 'Fashion Slideshow',
      title: 'Simple Style',
      description: 'From casual to formal, we’ve got you covered',
      cta: 'Shop collection',
    },
    {
      image: 'assets/images/slider/fashion-slideshow-03.jpg',
      alt: 'Fashion Slideshow',
      title: 'Elegant Glamour',
      description: 'From casual to formal, we’ve got you covered',
      cta: 'Shop collection',
    },
  ];

  ngAfterViewInit() {
    new Swiper('.tf-sw-slideshow', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 1000,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}
