import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateReceiptNumber } from "./utils";

export const list = query({
  args: {
    pharmacyId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_pharmacyId_date", (q) => q.eq("pharmacyId", args.pharmacyId))
      .order("desc")
      .take(args.limit ?? 50);
    return sales;
  },
});

export const getById = query({
  args: { id: v.id("sales") },
  handler: async (ctx, args) => {
    const sale = await ctx.db.get(args.id);
    if (!sale) return null;
    const items = await ctx.db
      .query("saleItems")
      .withIndex("by_saleId", (q) => q.eq("saleId", args.id))
      .collect();
    return { ...sale, items };
  },
});

export const processSale = mutation({
  args: {
    pharmacyId: v.string(),
    cashierId: v.id("users"),
    cashierName: v.string(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("mobile_money"),
      v.literal("card"),
      v.literal("credit")
    ),
    discount: v.number(),
    amountPaid: v.number(),
    customerName: v.optional(v.string()),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        inventoryItemId: v.id("inventoryItems"),
        itemName: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        costPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Validate stock for each item
    for (const item of args.items) {
      const invItem = await ctx.db.get(item.inventoryItemId);
      if (!invItem) throw new Error(`Item ${item.itemName} not found in inventory`);
      if (invItem.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.itemName}. Available: ${invItem.quantity}`);
      }
    }

    const subtotal = args.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const total = Math.max(0, subtotal - args.discount);
    const change = args.amountPaid - total;
    const receiptNumber = generateReceiptNumber(args.pharmacyId);
    const now = Date.now();

    // Create sale record
    const saleId = await ctx.db.insert("sales", {
      pharmacyId: args.pharmacyId,
      receiptNumber,
      cashierId: args.cashierId,
      cashierName: args.cashierName,
      paymentMethod: args.paymentMethod,
      subtotal,
      discount: args.discount,
      total,
      amountPaid: args.amountPaid,
      change,
      customerName: args.customerName,
      notes: args.notes,
      status: "completed",
      createdAt: now,
    });

    // Create sale items and deduct stock
    for (const item of args.items) {
      await ctx.db.insert("saleItems", {
        saleId,
        pharmacyId: args.pharmacyId,
        inventoryItemId: item.inventoryItemId,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        subtotal: item.unitPrice * item.quantity,
      });

      // Deduct from inventory
      const invItem = await ctx.db.get(item.inventoryItemId);
      if (invItem) {
        await ctx.db.patch(item.inventoryItemId, {
          quantity: invItem.quantity - item.quantity,
          updatedAt: now,
        });
      }
    }

    return { saleId, receiptNumber, total, change };
  },
});

export const getDailySummary = query({
  args: { pharmacyId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const startOfDay = new Date(args.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(args.date);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_pharmacyId_date", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), startOfDay.getTime()),
          q.lte(q.field("createdAt"), endOfDay.getTime()),
          q.eq(q.field("status"), "completed")
        )
      )
      .collect();

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const transactionCount = sales.length;

    // Calculate profit
    const saleItems = await Promise.all(
      sales.map((s) =>
        ctx.db
          .query("saleItems")
          .withIndex("by_saleId", (q) => q.eq("saleId", s._id))
          .collect()
      )
    );
    const allItems = saleItems.flat();
    const totalCost = allItems.reduce((sum, i) => sum + i.costPrice * i.quantity, 0);
    const totalRevenueFull = allItems.reduce((sum, i) => sum + i.subtotal, 0);
    const grossProfit = totalRevenueFull - totalCost;

    return { totalRevenue, transactionCount, grossProfit, sales };
  },
});

export const getSalesTrend = query({
  args: { pharmacyId: v.string(), days: v.number() },
  handler: async (ctx, args) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - args.days);
    startDate.setHours(0, 0, 0, 0);

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_pharmacyId_date", (q) => q.eq("pharmacyId", args.pharmacyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), startDate.getTime()),
          q.eq(q.field("status"), "completed")
        )
      )
      .collect();

    // Group by date
    const byDate: Record<string, { revenue: number; transactions: number }> = {};
    for (const sale of sales) {
      const dateKey = new Date(sale.createdAt).toISOString().split("T")[0] ?? "";
      if (!byDate[dateKey]) byDate[dateKey] = { revenue: 0, transactions: 0 };
      byDate[dateKey].revenue += sale.total;
      byDate[dateKey].transactions += 1;
    }

    return Object.entries(byDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getTopSellingItems = query({
  args: { pharmacyId: v.string(), limit: v.number() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("saleItems")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .collect();

    const byItem: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const item of items) {
      if (!byItem[item.inventoryItemId]) {
        byItem[item.inventoryItemId] = { name: item.itemName, quantity: 0, revenue: 0 };
      }
      byItem[item.inventoryItemId]!.quantity += item.quantity;
      byItem[item.inventoryItemId]!.revenue += item.subtotal;
    }

    return Object.entries(byItem)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, args.limit);
  },
});
