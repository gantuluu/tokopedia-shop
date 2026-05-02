export interface Product {
  produks_id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  media: string[];
  stock_total: number;
  stock_sold: number;
  price: number;
  sale_price: number;
  colors: string; // JSON string of ColorVariant[]
  variants: string; // JSON string of StorageVariant[]
  shop_name: string;
  shop_rating: number;
  shop_followers: number;
  shop_location: string;
  shop_response_time: string;
  shop_image: string;
  shop_verified: boolean;
  reviews_average: number;
  reviews_total: number;
  url: string;
}

export interface ColorVariant {
  name: string;
  hex: string;
  imgUrl?: string;
  image?: string;
}

export interface StorageVariant {
  storage: string;
  price: number;
  sale_price: number;
}
