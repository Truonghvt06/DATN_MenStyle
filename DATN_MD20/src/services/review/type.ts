export interface ReviewCreateType {
  product_id: string;
  order_id: string;
  product_variant_id: string;
  rating: number;
  comment?: string;
}
