import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductStatusEnum } from '@/app/[language]/types/product';
import { VendorStatusEnum } from '@/app/[language]/types/vendor';

export type FieldType = 
  | 'text'
  | 'number' 
  | 'price' 
  | 'email'
  | 'tel'
  | 'url'
  | 'multiselect' 
  | 'vendor'
  | 'textarea'
  | 'vendorTypes'
  | 'select'
  | 'date'
  | 'time'
  | 'image'
  | 'address'
  | 'duration'
  | 'break'
  | 'requirements';

export type BaseFieldValue = string | number | Date | string[] | null;

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
  approvalButtons?: {
    type: 'vendor' | 'product';
    currentStatus: ProductStatusEnum | VendorStatusEnum;
    onStatusChange: (status: ProductStatusEnum | VendorStatusEnum) => Promise<void>;
  };
}

export interface FormData {
  [key: string]: BaseFieldValue;
}

export interface BaseCardProps {
  config: CardConfig;
  initialData: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  customActions?: ReactNode;
  isSubmitting?: boolean;
  onChange?: (data: FormData) => void;
  mode?: 'edit' | 'create';
  children?: ReactNode;
}

export interface SharedCardActionsProps {
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
  methods: UseFormReturn<FormData>;
  customActions?: ReactNode;
  t: (key: string) => string;
  type: 'vendor' | 'product';
  mode?: 'edit' | 'create';
}

export interface FormValuesMonitorProps {
  onChange?: (data: FormData) => void;
}

export interface CardSectionProps {
  section: SectionConfig;
  mode?: 'edit' | 'create';
}

export interface CardFieldProps {
  field: FieldConfig;
  mode?: Mode;
}

export interface ApprovalButtonsProps {
  type: 'vendor' | 'product';
  currentStatus: ProductStatusEnum | VendorStatusEnum;
  onStatusChange: (status: ProductStatusEnum | VendorStatusEnum) => Promise<void>;
  isSubmitting: boolean;
}

export interface ImageUploadFieldProps {
  field: FieldConfig;
  mode?: 'edit' | 'create';
}

export interface AddressFieldProps {
  field: FieldConfig;
  mode?: 'edit' | 'create';
}

export interface ValidationError {
  type: string;
  message: string;
}

export interface FieldValidation {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: BaseFieldValue) => boolean | string | Promise<boolean | string>;
}

export interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  isValid: boolean;
}

export type Mode = 'edit' | 'create';
export type EntityType = 'vendor' | 'product';