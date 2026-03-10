import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    pharmacyId: v.string(),
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (args.category) {
      items = items.filter((i) => i.category === args.category);
    }
    if (args.search) {
      const search = args.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          (i.genericName ?? "").toLowerCase().includes(search) ||
          (i.batchNumber ?? "").toLowerCase().includes(search)
      );
    }

    return items.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getById = query({
  args: { id: v.id("inventoryItems") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getLowStock = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return items.filter((i) => i.quantity <= i.reorderLevel);
  },
});

export const getExpiringSoon = query({
  args: { pharmacyId: v.string(), daysThreshold: v.number() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + args.daysThreshold);
    const thresholdStr = thresholdDate.toISOString().split("T")[0];

    return items.filter(
      (i) => i.expiryDate && i.expiryDate <= (thresholdStr ?? "")
    );
  },
});

export const add = mutation({
  args: {
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
    unit: v.string(),
    expiryDate: v.optional(v.string()),
    batchNumber: v.optional(v.string()),
    barcode: v.optional(v.string()),
    description: v.optional(v.string()),
    storageCondition: v.optional(v.string()),
    requiresPrescription: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("inventoryItems", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("inventoryItems"),
    name: v.optional(v.string()),
    genericName: v.optional(v.string()),
    category: v.optional(v.string()),
    supplierName: v.optional(v.string()),
    costPrice: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    quantity: v.optional(v.number()),
    reorderLevel: v.optional(v.number()),
    unit: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    batchNumber: v.optional(v.string()),
    description: v.optional(v.string()),
    storageCondition: v.optional(v.string()),
    requiresPrescription: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const deactivate = mutation({
  args: { id: v.id("inventoryItems") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false, updatedAt: Date.now() });
  },
});

export const adjustStock = mutation({
  args: {
    id: v.id("inventoryItems"),
    adjustment: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Item not found");
    const newQuantity = Math.max(0, item.quantity + args.adjustment);
    await ctx.db.patch(args.id, { quantity: newQuantity, updatedAt: Date.now() });
    return newQuantity;
  },
});

export const getCategories = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    const categories = [...new Set(items.map((i) => i.category))].sort();
    return categories;
  },
});

export const getStats = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("inventoryItems")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const totalItems = items.length;
    const lowStock = items.filter((i) => i.quantity > 0 && i.quantity <= i.reorderLevel).length;
    const outOfStock = items.filter((i) => i.quantity === 0).length;
    const totalValue = items.reduce((sum, i) => sum + i.costPrice * i.quantity, 0);

    const today = new Date().toISOString().split("T")[0] ?? "";
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] ?? "";
    const expiringSoon = items.filter((i) => i.expiryDate && i.expiryDate <= in30Days && i.expiryDate >= today).length;
    const expired = items.filter((i) => i.expiryDate && i.expiryDate < today).length;

    return { totalItems, lowStock, outOfStock, totalValue, expiringSoon, expired };
  },
});
