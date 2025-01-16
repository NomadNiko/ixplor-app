import { Control } from 'react-hook-form';

export interface ProductFormData {
  productName: string;
  productDescription: string;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  productPrice: number;
  productDuration?: number;
  productDate?: string;
  productStartTime?: string;
  productEndTime?: string;
  productAdditionalInfo?: string;
  productRequirements?: string[];
  productImageURL?: string;
  productWaiver?: string;
}

export interface StepProps {
  control: Control<ProductFormData>;
  t: (key: string) => string;
}