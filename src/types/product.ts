export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  categoryId: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  price: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  discount?: number;
  description?: string;
  descriptionAr?: string;
  features?: string[];
  featuresAr?: string[];
  sizes?: string[];
  inStock?: boolean;
  categoryId: string;
  subcategoryId?: string;
}
