export interface CategoryRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface CategoryFormValues {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}
