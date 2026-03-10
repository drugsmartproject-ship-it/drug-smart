export type UserRole = "owner" | "admin" | "cashier" | "pharmacist" | "inventory_manager";

export type PaymentMethod = "cash" | "mobile_money" | "card" | "credit";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pharmacyId: string;
}

export interface AuthPharmacy {
  name: string;
  displayName?: string;
  pharmacyId: string;
  town: string;
}

export interface AuthState {
  user: AuthUser | null;
  pharmacy: AuthPharmacy | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface InventoryItem {
  _id: string;
  pharmacyId: string;
  name: string;
  genericName?: string;
  category: string;
  supplierName?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  unit: string;
  expiryDate?: string;
  batchNumber?: string;
  description?: string;
  storageCondition?: string;
  requiresPrescription: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Sale {
  _id: string;
  pharmacyId: string;
  receiptNumber: string;
  cashierName: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  customerName?: string;
  status: "completed" | "refunded" | "voided";
  createdAt: number;
}

export interface SaleItem {
  _id: string;
  saleId: string;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subtotal: number;
}

export interface CartItem {
  inventoryItemId: string;
  itemName: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  maxQuantity: number;
}

export interface User {
  _id: string;
  pharmacyId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  lastLoginAt?: number;
}

export interface Supplier {
  _id: string;
  pharmacyId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: number;
}

export interface DrugIntelligenceResult {
  genericName: string;
  brandNames: string[];
  category: string;
  uses: string[];
  dosageForm: string[];
  commonDosage: string;
  warnings: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  storageConditions: string;
  pregnancyCategory?: string;
  requiresPrescription: boolean;
}

export const DRUG_CATEGORIES = [
  "Analgesics & Anti-inflammatory",
  "Antibiotics & Antivirals",
  "Antifungals & Antiparasitics",
  "Cardiovascular",
  "Dermatology",
  "Diabetes & Endocrine",
  "Digestive & GI",
  "ENT & Respiratory",
  "Eye & Ear Care",
  "Herbal & Natural Products",
  "Maternal & Child Health",
  "Mental Health & Neurology",
  "Minerals & Supplements",
  "Oncology",
  "Urology & Renal",
  "Vaccines & Biologics",
  "Vitamins & Nutritional",
  "Other / Miscellaneous",
] as const;

export type DrugCategory = typeof DRUG_CATEGORIES[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  cashier: "Cashier",
  pharmacist: "Pharmacist",
  inventory_manager: "Inventory Manager",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  owner: "brand",
  admin: "teal",
  cashier: "info",
  pharmacist: "success",
  inventory_manager: "warning",
};

export const PERMISSIONS = {
  canManageUsers: (role: UserRole) => ["owner", "admin"].includes(role),
  canManageInventory: (role: UserRole) => ["owner", "admin", "inventory_manager"].includes(role),
  canProcessSales: (role: UserRole) => ["owner", "admin", "cashier"].includes(role),
  canAccessAnalytics: (role: UserRole) => ["owner", "admin"].includes(role),
  canAccessDrugIntel: (role: UserRole) => ["owner", "admin", "pharmacist"].includes(role),
  canManageSettings: (role: UserRole) => ["owner", "admin"].includes(role),
  canViewInventory: (_role: UserRole) => true,
} as const;
