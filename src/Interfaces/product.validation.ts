/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface IProduct {
  _id?: string;
  category: string[];
  discountAmount: number;
  featured: boolean;
  isDiscount: boolean;
  metas: string[];
  name: string;
  netPrice?: number;
  price: number;
  rating?: number;
  slug?: string;
  stockStatus?: IProductItem[];
}

export interface IProductColor {
  _id?: string;
  code: string;
  name: string;
}

export interface IProductItem {
  _id?: string;
  color?: string;
  quantity?: number;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
}
