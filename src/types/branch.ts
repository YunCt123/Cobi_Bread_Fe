export interface Branch {
  id: string;
  code?: string;
  name: string;
  nameEn?: string | null;
  address: string;
  addressEn?: string | null;
  city: string;
  cityEn?: string | null;
  openHours: string;
  phone: string;
  mapUrl?: string | null;
  isActive?: boolean;
  _count?: {
    orders?: number;
    batches?: number;
    users?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBranchInput {
  code?: string;
  name: string;
  nameEn?: string;
  address: string;
  addressEn?: string;
  city: string;
  cityEn?: string;
  openHours: string;
  phone: string;
  mapUrl?: string;
  isActive?: boolean;
}

export type UpdateBranchInput = Partial<CreateBranchInput>;

export type BranchPayload = CreateBranchInput;
