import { Product } from './types';

export const initialProduksList: Product[] = [
  {
    produks_id: "8BhBAnanTagA7",
    title: "Apple iPhone 15 Pro Max 256GB 512GB 1TB Garansi Resmi iBox",
    description: "iPhone 15 Pro Max dengan desain titanium yang kuat dan ringan, bagian belakang kaca matte bertekstur, Ceramic Shield di bagian depan, serta tahan cipratan, air, dan debu.",
    category: "Elektronik",
    brand: "Apple",
    media: [
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/27b87834-08eb-4e67-a2f2-8c105cb02558.jpg",
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/cd549553-61ab-4357-bb03-b09e25d2ea99.jpg",
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/e0ab7799-73fb-4cdb-8667-8eec55304b4c.jpg"
    ],
    stock_total: 150,
    stock_sold: 450,
    price: 24999000,
    sale_price: 22999000,
    colors: JSON.stringify([
      {
        name: "Natural Titanium",
        hex: "#8c8984",
        imgUrl: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/27b87834-08eb-4e67-a2f2-8c105cb02558.jpg"
      },
      {
        name: "Blue Titanium",
        hex: "#4d535b",
        imgUrl: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/cd549553-61ab-4357-bb03-b09e25d2ea99.jpg"
      },
      {
        name: "Black Titanium",
        hex: "#3b3a36",
        imgUrl: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/e0ab7799-73fb-4cdb-8667-8eec55304b4c.jpg"
      }
    ]),
    variants: JSON.stringify([
      {
        storage: "256GB",
        price: 24999000,
        sale_price: 22999000
      },
      {
        storage: "512GB",
        price: 29999000,
        sale_price: 27999000
      },
      {
        storage: "1TB",
        price: 33999000,
        sale_price: 31999000
      }
    ]),
    shop_name: "iBox Official Shop",
    shop_rating: 4.9,
    shop_followers: 1200000,
    shop_location: "Jakarta Pusat",
    shop_response_time: "± 2 jam",
    shop_image: "https://images.tokopedia.net/img/cache/215-square/shops-1/2020/1/22/7516801/7516801_f4f165e0-5cf0-43a5-bdfc-851f618a80d4.jpg",
    shop_verified: true,
    reviews_average: 4.9,
    reviews_total: 215,
    url: "https://www.tokopedia.com"
  },
  {
    produks_id: "iphone-15-pro",
    title: "Apple iPhone 15 Pro 128GB 256GB 512GB Garansi Resmi iBox",
    description: "iPhone 15 Pro. Kekuatan Titanium. Chip A17 Pro yang mengubah segalanya. Tombol Tindakan yang dapat disesuaikan. Sistem kamera iPhone paling bertenaga yang pernah ada.",
    category: "Elektronik",
    brand: "Apple",
    media: [
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/06de0f78-a28a-4467-8b0b-1934c1b97931.jpg",
      "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/90605a91-4cf1-4560-8f9f-0c4a019676e1.jpg"
    ],
    stock_total: 80,
    stock_sold: 1200,
    price: 20999000,
    sale_price: 18999000,
    colors: JSON.stringify([
      {
        name: "Natural Titanium",
        hex: "#8c8984",
        imgUrl: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/06de0f78-a28a-4467-8b0b-1934c1b97931.jpg"
      },
      {
        name: "White Titanium",
        hex: "#f2f1ed",
        imgUrl: "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/10/16/90605a91-4cf1-4560-8f9f-0c4a019676e1.jpg"
      }
    ]),
    variants: JSON.stringify([
      {
        storage: "128GB",
        price: 20999000,
        sale_price: 18999000
      },
      {
        storage: "256GB",
        price: 23999000,
        sale_price: 21999000
      }
    ]),
    shop_name: "iBox Official Shop",
    shop_rating: 4.9,
    shop_followers: 1200000,
    shop_location: "Jakarta Pusat",
    shop_response_time: "± 2 jam",
    shop_image: "https://images.tokopedia.net/img/cache/215-square/shops-1/2020/1/22/7516801/7516801_f4f165e0-5cf0-43a5-bdfc-851f618a80d4.jpg",
    shop_verified: true,
    reviews_average: 4.8,
    reviews_total: 1050,
    url: "https://www.tokopedia.com"
  }
];
