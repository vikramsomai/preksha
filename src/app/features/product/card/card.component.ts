import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  wishListArray: any[] = [];
  productList = [
    {
      name: 'Ribbed modal T-shirt',
      price: 'NPR. 4000',
      sizes: ['M', 'L', 'XL'],
      colors: [
        {
          name: 'Brown',
          image: 'assets/images/products/brown.jpg',
          hoverImage: 'assets/images/products/purple.jpg',
        },
        {
          name: 'Light Purple',
          image: 'assets/images/products/purple.jpg',
          hoverImage: 'assets/images/products/brown.jpg',
        },
        {
          name: 'Light Green',
          image: 'assets/images/products/green.jpg',
          hoverImage: 'assets/images/products/purple.jpg',
        },
      ],
    },
    {
      name: 'Regular Fit Oxford Shirt',
      price: 'NPR. 5000',
      sizes: ['S', 'M', 'L'],
      colors: [
        {
          name: 'Black',
          image: 'assets/images/products/black-4.jpg',
          hoverImage: 'assets/images/products/black-5.jpg',
        },
        {
          name: 'Dark Blue',
          image: 'assets/images/products/dark-blue-2.jpg',
          hoverImage: 'assets/images/products/dark-blue-2.jpg',
        },
        {
          name: 'Beige',
          image: 'assets/images/products/beige.jpg',
          hoverImage: 'assets/images/products/beige.jpg',
        },
        {
          name: 'Light Blue',
          image: 'assets/images/products/light-blue.jpg',
          hoverImage: 'assets/images/products/light-blue.jpg',
        },
        {
          name: 'White',
          image: 'assets/images/products/white-7.jpg',
          hoverImage: 'assets/images/products/white-7.jpg',
        },
      ],
      id: 1,
    },
    {
      name: 'Loose Fit Hoodie',
      price: 'NPR. 10000',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        {
          name: 'White',
          image: 'assets/images/products/white-8.jpg',
          hoverImage: 'assets/images/products/black-6.jpg',
        },
        {
          name: 'Black',
          image: 'assets/images/products/black-7.jpg',
          hoverImage: 'assets/images/products/black-7.jpg',
        },
        {
          name: 'Blue',
          image: 'assets/images/products/blue-2.jpg',
          hoverImage: 'assets/images/products/blue-2.jpg',
        },
      ],
      id: 2,
    },
    {
      name: 'Patterned Scarf',
      price: 'NPR. 4000',
      sizes: ['M', 'L', 'XL'],
      colors: [
        {
          name: 'Brown',
          image: 'assets/images/products/brown-4.jpg',
          hoverImage: 'assets/images/products/black-8.jpg',
        },
        {
          name: 'Black',
          image: 'assets/images/products/black-8.jpg',
          hoverImage: 'assets/images/products/black-8.jpg',
        },
      ],
      id: 3,
    },
    {
      name: 'Slim Fit Fine-knit Turtleneck Sweater',
      price: 'NPR. 2400',
      sizes: ['S', 'M', 'L'],
      colors: [
        {
          name: 'Black',
          image: 'assets/images/products/black-9.jpg',
          hoverImage: 'assets/images/products/black-10.jpg',
        },
        {
          name: 'White',
          image: 'assets/images/products/white-9.jpg',
          hoverImage: 'assets/images/products/white-9.jpg',
        },
      ],
      id: 4,
    },
  ];
  ngOnInit(): void {
    this.wishListArray = JSON.parse(
      localStorage.getItem('prekshawishlist') as string
    );
  }
  addWishlist(event: any) {
    console.log(event);
    this.wishListArray.push(event);
    localStorage.setItem('prekshawishlist', JSON.stringify(this.wishListArray));
  }
}
