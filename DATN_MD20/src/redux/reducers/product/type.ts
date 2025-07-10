export interface Variants {
  size: string;
  color: string;
  quantity: number;
  image: string;
}
export interface Product {
  // Tùy theo cấu trúc của sản phẩm, ví dụ như:
  _id: string;
  type: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating_avg: number;
  rating_count: number;
  sold_count: number;
  variants: Variants[];
}

export interface ProductState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  detail: Product | null; //sản phẩm chi tiết đang xem.
  relatedProducts: Product[]; //danh sách sản phẩm liên quan.
  loading: boolean;
  error: string | null;
}
