import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generatePharmacyId } from "./utils";

// Simple hash function - in production use proper bcrypt via action
function simpleHash(password: string): string {
  // This is a placeholder - real implementation uses convex actions with bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export const registerPharmacy = mutation({
  args: {
    pharmacyName: v.string(),
    ownerName: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.string(),
    town: v.string(),
    licenseNumber: v.optional(v.string()),
    displayName: v.optional(v.string()),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const pharmacyId = generatePharmacyId();
    const now = Date.now();

    // Create pharmacy workspace
    await ctx.db.insert("pharmacies", {
      pharmacyId,
      name: args.pharmacyName,
      ownerName: args.ownerName,
      email: args.email,
      phone: args.phone,
      location: args.location,
      town: args.town,
      licenseNumber: args.licenseNumber,
      displayName: args.displayName ?? args.pharmacyName,
      isActive: true,
      createdAt: now,
    });

    // Create owner account
    const userId = await ctx.db.insert("users", {
      pharmacyId,
      name: args.ownerName,
      email: args.email,
      passwordHash: simpleHash(args.password),
      role: "owner",
      isActive: true,
      createdAt: now,
    });

    // Create default settings
    await ctx.db.insert("pharmacySettings", {
      pharmacyId,
      lowStockAlertDays: 30,
      expiryAlertDays: 60,
      currency: "GHS",
      timezone: "Africa/Accra",
      taxRate: 0,
      enableLowStockAlerts: true,
      enableExpiryAlerts: true,
      enableSalesReports: true,
    });

    // Create session token
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      pharmacyId,
      token,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
      createdAt: now,
    });

    return { pharmacyId, token, userId };
  },
});

export const login = mutation({
  args: {
    pharmacyId: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify pharmacy exists
    const pharmacy = await ctx.db
      .query("pharmacies")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", args.pharmacyId))
      .first();
    if (!pharmacy) {
      throw new Error("Invalid Pharmacy ID. Please check and try again.");
    }
    if (!pharmacy.isActive) {
      throw new Error("This pharmacy workspace has been deactivated.");
    }

    // Find user
    const user = await ctx.db
      .query("users")
      .withIndex("by_pharmacyId_email", (q) =>
        q.eq("pharmacyId", args.pharmacyId).eq("email", args.email)
      )
      .first();
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    if (!user.isActive) {
      throw new Error("Your account has been deactivated. Contact your administrator.");
    }

    // Verify password
    if (user.passwordHash !== simpleHash(args.password)) {
      throw new Error("Invalid email or password.");
    }

    // Update last login
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });

    // Create session
    const token = generateToken();
    const now = Date.now();
    await ctx.db.insert("sessions", {
      userId: user._id,
      pharmacyId: args.pharmacyId,
      token,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
      createdAt: now,
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId,
        pharmacyName: pharmacy.name,
        displayName: pharmacy.displayName,
      },
    };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session) return null;
    if (session.expiresAt < Date.now()) return null;

    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) return null;

    const pharmacy = await ctx.db
      .query("pharmacies")
      .withIndex("by_pharmacyId", (q) => q.eq("pharmacyId", session.pharmacyId))
      .first();
    if (!pharmacy) return null;

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId,
      },
      pharmacy: {
        name: pharmacy.name,
        displayName: pharmacy.displayName,
        pharmacyId: pharmacy.pharmacyId,
        town: pharmacy.town,
      },
    };
  },
});
