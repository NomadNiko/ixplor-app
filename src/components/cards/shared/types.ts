import { ReactNode } from 'react';
import { ProductStatusEnum } from '@/app/[language]/types/product';
import { VendorStatusEnum } from '@/app/[language]/types/vendor';

export type FieldType = 
  | 'text'
  | 'number' 
  | 'email'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'date'
  | 'time'
  | 'image'
  | 'address';

export type BaseFieldValue = string | number | Date | null;

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: BaseFieldValue;
  fullWidth?: boolean;
  rows?: number;
  gridWidth?: 1 | 2 | 3 | 4 | 6 | 12;
  prefilled?: boolean;
}

export interface SectionConfig {
  id: string;
  title: string;
  fields: FieldConfig[];
}

export interface CardConfig {
  title: string;
  type: 'vendor' | 'product';
  sections: SectionConfig[];
}

export interface EditCardConfig extends CardConfig {
  approvalButtons?: {
    type: 'vendor' | 'product';
    currentStatus: ProductStatusEnum | VendorStatusEnum;
    onStatusChange: (status: ProductStatusEnum | VendorStatusEnum) => Promise<void>;
  };
}

export interface FormData {
  [key: string]: BaseFieldValue;
}

export interface CardProps {
  config: CardConfig;
  initialData: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  customActions?: ReactNode;
  isSubmitting?: boolean;
  onChange?: (data: FormData) => void;
}

export interface EditCardProps extends CardProps {
  config: EditCardConfig;
  onDelete?: () => Promise<void>;
}