import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByPharmacyId = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("pharmacies")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .first();
  },
});

export const updateDetails = mutation({
  args: {
    pharmacyId: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    town: v.optional(v.string()),
    displayName: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { pharmacyId, ...rest } = args;
    const pharmacy = await ctx.db
      .query("pharmacies")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", pharmacyId))
      .first();
    if (!pharmacy) throw new Error("Pharmacy not found");
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) updates[k] = v;
    }
    await ctx.db.patch(pharmacy._id, updates);
  },
});

export const getSettings = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("pharmacySettings")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .first();
  },
});

export const updateSettings = mutation({
  args: {
    pharmacyId: v.string(),
    lowStockAlertDays: v.optional(v.number()),
    expiryAlertDays: v.optional(v.number()),
    currency: v.optional(v.string()),
    receiptFooter: v.optional(v.string()),
    taxRate: v.optional(v.number()),
    enableLowStockAlerts: v.optional(v.boolean()),
    enableExpiryAlerts: v.optional(v.boolean()),
    enableSalesReports: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { pharmacyId, ...rest } = args;
    const settings = await ctx.db
      .query("pharmacySettings")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", pharmacyId))
      .first();
    if (!settings) throw new Error("Settings not found");
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) updates[k] = v;
    }
    await ctx.db.patch(settings._id, updates);
  },
});
