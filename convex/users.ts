import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

export const list = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .collect();
    return users.map(({ passwordHash: _ph, ...u }) => u);
  },
});

export const addStaff = mutation({
  args: {
    pharmacyId: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("cashier"),
      v.literal("pharmacist"),
      v.literal("inventory_manager")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_pharmacyId_email", (q) =>
        q.eq("pharmacyId", args.pharmacyId).eq("email", args.email)
      )
      .first();
    if (existing) throw new Error("A user with this email already exists in your workspace.");

    const now = Date.now();
    return ctx.db.insert("users", {
      pharmacyId: args.pharmacyId,
      name: args.name,
      email: args.email,
      passwordHash: simpleHash(args.password),
      role: args.role,
      isActive: true,
      createdAt: now,
    });
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("cashier"),
      v.literal("pharmacist"),
      v.literal("inventory_manager")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const toggleActive = mutation({
  args: { userId: v.id("users"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { isActive: args.isActive });
  },
});

export const resetPassword = mutation({
  args: { userId: v.id("users"), newPassword: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { passwordHash: simpleHash(args.newPassword) });
  },
});

export const getStats = query({
  args: { pharmacyId: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .collect();
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const byRole = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, active, inactive: total - active, byRole };
  },
});
