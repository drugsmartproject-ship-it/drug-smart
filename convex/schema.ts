import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pharmacies: defineTable({
    pharmacyId: v.string(),       // e.g. "PH-ABC123-XYZ"
    name: v.string(),
    ownerName: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.string(),
    town: v.string(),
    licenseNumber: v.optional(v.string()),
    displayName: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_pharmacyId", ["pharmacyId"])
    .index("by_email", ["email"]),

  users: defineTable({
    pharmacyId: v.string(),
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("cashier"),
      v.literal("pharmacist"),
      v.literal("inventory_manager")
    ),
    isActive: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    avatarUrl: v.optional(v.string()),
  })
    .index("by_pharmacyId", ["pharmacyId"])
    .index("by_email", ["email"])
    .index("by_pharmacyId_email", ["pharmacyId", "email"]),

  sessions: defineTable({
    userId: v.id("users"),
    pharmacyId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  suppliers: defineTable({
    pharmacyId: v.string(),
    name: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_pharmacyId", ["pharmacyId"]),

  inventoryItems: defineTable({
    pharmacyId: v.string(),
    name: v.string(),
    genericName: v.optional(v.string()),
    category: v.string(),
    supplierId: v.optional(v.id("suppliers")),
    supplierName: v.optional(v.string()),
    costPrice: v.number(),
    sellingPrice: v.number(),
    quantity: v.number(),
    reorderLevel: v.number(),
    unit: v.string(),              // e.g. "tablets", "bottles", "vials"
    expiryDate: v.optional(v.string()),   // ISO date string
    batchNumber: v.optional(v.string()),
    barcode: v.optional(v.string()),
    description: v.optional(v.string()),
    storageCondition: v.optional(v.string()),
    requiresPrescription: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pharmacyId", ["pharmacyId"])
    .index("by_pharmacyId_category", ["pharmacyId", "category"])
    .index("by_pharmacyId_name", ["pharmacyId", "name"]),

  sales: defineTable({
    pharmacyId: v.string(),
    receiptNumber: v.string(),
    cashierId: v.id("users"),
    cashierName: v.string(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("mobile_money"),
      v.literal("card"),
      v.literal("credit")
    ),
    subtotal: v.number(),
    discount: v.number(),
    total: v.number(),
    amountPaid: v.number(),
    change: v.number(),
    customerName: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(v.literal("completed"), v.literal("refunded"), v.literal("voided")),
    createdAt: v.number(),
  })
    .index("by_pharmacyId", ["pharmacyId"])
    .index("by_pharmacyId_date", ["pharmacyId", "createdAt"])
    .index("by_receiptNumber", ["receiptNumber"]),

  saleItems: defineTable({
    saleId: v.id("sales"),
    pharmacyId: v.string(),
    inventoryItemId: v.id("inventoryItems"),
    itemName: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    costPrice: v.number(),
    subtotal: v.number(),
  })
    .index("by_saleId", ["saleId"])
    .index("by_pharmacyId", ["pharmacyId"])
    .index("by_inventoryItemId", ["inventoryItemId"]),

  activityLogs: defineTable({
    pharmacyId: v.string(),
    userId: v.id("users"),
    userName: v.string(),
    action: v.string(),
    entity: v.string(),
    entityId: v.optional(v.string()),
    details: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_pharmacyId", ["pharmacyId"])
    .index("by_pharmacyId_date", ["pharmacyId", "createdAt"]),

  pharmacySettings: defineTable({
    pharmacyId: v.string(),
    lowStockAlertDays: v.number(),     // days before expiry to alert
    expiryAlertDays: v.number(),
    currency: v.string(),
    timezone: v.string(),
    receiptFooter: v.optional(v.string()),
    taxRate: v.number(),
    enableLowStockAlerts: v.boolean(),
    enableExpiryAlerts: v.boolean(),
    enableSalesReports: v.boolean(),
  }).index("by_pharmacyId", ["pharmacyId"]),
});
