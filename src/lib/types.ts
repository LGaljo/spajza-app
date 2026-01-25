export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  UNAPPROVED = 'UNAPPROVED',
  KEEPER = 'KEEPER',
}

export enum ChangeType {
  ADDED = 'added',
  REMOVED = 'removed',
  CHANGED = 'changed',
}

export enum ItemStatus {
  NEW = 'NEW',
  BORROWED = 'BORROWED',
  STORED = 'STORED',
  WRITTEN_OFF = 'WRITTEN_OFF',
}

export interface Category {
  _id: string;
  name: string;
  templateImage?: {
    Location: string;
    key?: string;
  } | null;
  _deletedAt?: string | Date;
}

export interface Tag {
  _id: string;
  name: string;
  _deletedAt?: string | Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: Role | string;
  hash?: string;
  salt?: number;
  _createdAt?: string | Date;
  _updatedAt?: string | Date;
  _deletedAt?: string | Date;
}

export interface TraceChange {
  key: string;
  type: ChangeType;
  valueBefore?: string;
  valueNow?: string;
}

export interface Trace {
  _id: string;
  type: string;
  originalObjectId: string;
  changes: TraceChange[];
  user: User | string;
  _createdAt: string | Date;
}

export interface InventoryItem {
  _id: string;
  name: string;
  nngrams?: string;
  code?: number;
  owner?: string;
  location?: string;
  count?: number;
  tags?: Tag[];
  description?: string;
  retired?: boolean;
  status?: ItemStatus | string;
  cover?: Array<{
    Location: string;
    key?: string;
  }>;
  rents?: {
    renter?: User | string;
    subject?: string;
    borrowedAt?: string | Date;
    returnTime?: string | Date;
  };
  category?: Category;
  _createdAt?: string | Date;
  _updatedAt?: string | Date;
  _deletedAt?: string | Date;
  boughtTime?: string | Date;
  extras?: {
    defects?: Array<{
      top: number;
      left: number;
      text: string;
      date: string | Date;
      key: string;
    }>;
  } | null;
}
