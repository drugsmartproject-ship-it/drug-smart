/**
 * Seed mutation for development / demo purposes.
 *
 * Creates two pharmacy workspaces with staff, inventory, sales, and activity data.
 *
 * Usage: call api.seed.seedDemoData from the Convex dashboard or a dev script.
 *
 * DEMO CREDENTIALS:
 * ──────────────────────────────────────────────────────────────
 * Workspace 1 — MedServe Pharmacy, Accra
 *   Pharmacy ID: generated (printed to console / returned)
 *   Owner:  kwame.owusu@medserve.gh  / Demo@1234
 *   Admin:  ama.asante@medserve.gh   / Demo@1234
 *   Cashier: kofi.mensah@medserve.gh  / Demo@1234
 *
 * Workspace 2 — LifeCare Pharmacy, Kumasi
 *   Pharmacy ID: generated
 *   Owner:  adjoa.boateng@lifecare.gh / Demo@1234
 *   Pharmacist: yaw.ampem@lifecare.gh / Demo@1234
 * ──────────────────────────────────────────────────────────────
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Simplified password hash (matches auth.ts implementation)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

function generatePharmacyId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `PH-${seg(4)}-${seg(4)}`;
}

function generateReceiptNumber(index: number): string {
  return `RCP-${String(index + 1).padStart(6, "0")}`;
}

const DEMO_PASSWORD = "Demo@1234";

export const seedDemoData = mutation({
  args: { force: v.optional(v.boolean()) },
  handler: async (ctx, { force }) => {
    // Guard: don't re-seed unless forced
    const existing = await ctx.db.query("pharmacies").first();
    if (existing && !force) {
      return { message: "Database already has data. Pass force: true to re-seed.", skipped: true };
    }

    const now = Date.now();
    const DAY = 86400000;
    const passwordHash = simpleHash(DEMO_PASSWORD);

    // ════════════════════════════════════════════════════════════
    // WORKSPACE 1 — MedServe Pharmacy, Accra
    // ════════════════════════════════════════════════════════════
    const ph1Id = generatePharmacyId();

    await ctx.db.insert("pharmacies", {
      pharmacyId: ph1Id,
      name: "MedServe Pharmacy",
      ownerName: "Kwame Owusu",
      email: "kwame.owusu@medserve.gh",
      phone: "+233 20 123 4567",
      location: "Osu Oxford Street, Shop 14",
      town: "Accra",
      licenseNumber: "PMRB-0081-2022",
      displayName: "MedServe",
      isActive: true,
      createdAt: now - 180 * DAY,
    });

    await ctx.db.insert("pharmacySettings", {
      pharmacyId: ph1Id,
      lowStockAlertDays: 30,
      expiryAlertDays: 60,
      currency: "GHS",
      timezone: "Africa/Accra",
      taxRate: 0,
      receiptFooter: "Thank you for choosing MedServe. Keep medicines out of reach of children.",
      enableLowStockAlerts: true,
      enableExpiryAlerts: true,
      enableSalesReports: true,
    });

    // Staff for Workspace 1
    const kwameId = await ctx.db.insert("users", {
      pharmacyId: ph1Id,
      name: "Kwame Owusu",
      email: "kwame.owusu@medserve.gh",
      passwordHash,
      role: "owner",
      isActive: true,
      createdAt: now - 180 * DAY,
    });

    const amaId = await ctx.db.insert("users", {
      pharmacyId: ph1Id,
      name: "Ama Asante",
      email: "ama.asante@medserve.gh",
      passwordHash,
      role: "admin",
      isActive: true,
      createdAt: now - 160 * DAY,
    });

    const kofiId = await ctx.db.insert("users", {
      pharmacyId: ph1Id,
      name: "Kofi Mensah",
      email: "kofi.mensah@medserve.gh",
      passwordHash,
      role: "cashier",
      isActive: true,
      createdAt: now - 90 * DAY,
    });

    await ctx.db.insert("users", {
      pharmacyId: ph1Id,
      name: "Abena Darko",
      email: "abena.darko@medserve.gh",
      passwordHash,
      role: "pharmacist",
      isActive: true,
      createdAt: now - 45 * DAY,
    });

    await ctx.db.insert("users", {
      pharmacyId: ph1Id,
      name: "Nana Boateng",
      email: "nana.boateng@medserve.gh",
      passwordHash,
      role: "inventory_manager",
      isActive: false,
      createdAt: now - 30 * DAY,
    });

    // Suppliers for Workspace 1
    const sup1 = await ctx.db.insert("suppliers", {
      pharmacyId: ph1Id,
      name: "Ernest Chemist Ltd",
      contactName: "Ernest Asiedu",
      email: "orders@ernestchemist.com",
      phone: "+233 30 222 3456",
      address: "Ring Road West, Accra",
      isActive: true,
      createdAt: now - 180 * DAY,
    });

    await ctx.db.insert("suppliers", {
      pharmacyId: ph1Id,
      name: "Kinapharma Ltd",
      contactName: "Sales Team",
      phone: "+233 30 250 0000",
      address: "Spintex Road, Accra",
      isActive: true,
      createdAt: now - 90 * DAY,
    });

    // Inventory for Workspace 1 — realistic Ghana pharmacy drugs
    const inv1Items = [
      // Analgesics
      { name: "Panadol Extra", genericName: "Paracetamol + Caffeine", category: "Analgesics & Pain Relief", costPrice: 2.5, sellingPrice: 4.0, quantity: 240, reorderLevel: 50, unit: "Tablets", expiryDate: "2026-08-15", batchNumber: "PCE-2024-001", requiresPrescription: false, storageCondition: "Store below 25°C" },
      { name: "Ibuprofen 400mg", genericName: "Ibuprofen", category: "Analgesics & Pain Relief", costPrice: 1.8, sellingPrice: 3.5, quantity: 8, reorderLevel: 30, unit: "Tablets", expiryDate: "2026-03-20", batchNumber: "IBU-2024-012", requiresPrescription: false },
      { name: "Diclofenac 50mg", genericName: "Diclofenac Sodium", category: "Analgesics & Pain Relief", costPrice: 2.0, sellingPrice: 3.8, quantity: 0, reorderLevel: 20, unit: "Tablets", expiryDate: "2026-05-10", requiresPrescription: false },
      // Antibiotics
      { name: "Amoxicillin 500mg", genericName: "Amoxicillin Trihydrate", category: "Antibiotics", costPrice: 3.5, sellingPrice: 6.5, quantity: 18, reorderLevel: 30, unit: "Capsules", expiryDate: "2026-06-30", batchNumber: "AMX-2024-007", requiresPrescription: true, storageCondition: "Store below 25°C, protect from moisture" },
      { name: "Ciprofloxacin 500mg", genericName: "Ciprofloxacin HCl", category: "Antibiotics", costPrice: 4.0, sellingPrice: 7.0, quantity: 60, reorderLevel: 20, unit: "Tablets", expiryDate: "2025-04-15", batchNumber: "CIP-2024-003", requiresPrescription: true },
      { name: "Azithromycin 250mg", genericName: "Azithromycin Dihydrate", category: "Antibiotics", costPrice: 5.0, sellingPrice: 9.0, quantity: 45, reorderLevel: 15, unit: "Tablets", expiryDate: "2026-11-30", requiresPrescription: true },
      { name: "Metronidazole 400mg", genericName: "Metronidazole", category: "Antibiotics", costPrice: 1.5, sellingPrice: 3.0, quantity: 180, reorderLevel: 40, unit: "Tablets", expiryDate: "2026-09-01", batchNumber: "MNZ-2024-009", requiresPrescription: false },
      // Antimalarials
      { name: "Coartem 80/480mg", genericName: "Artemether/Lumefantrine", category: "Antimalarials", costPrice: 8.0, sellingPrice: 14.0, quantity: 35, reorderLevel: 20, unit: "Tablets", expiryDate: "2026-07-30", batchNumber: "CTM-2024-002", requiresPrescription: false },
      { name: "Artesunate 200mg", genericName: "Artesunate", category: "Antimalarials", costPrice: 6.0, sellingPrice: 11.0, quantity: 50, reorderLevel: 15, unit: "Tablets", expiryDate: "2026-01-20", batchNumber: "ATS-2024-005", requiresPrescription: false },
      // Antihypertensives
      { name: "Amlodipine 10mg", genericName: "Amlodipine Besylate", category: "Cardiovascular", costPrice: 3.0, sellingPrice: 5.5, quantity: 120, reorderLevel: 30, unit: "Tablets", expiryDate: "2027-02-28", batchNumber: "AML-2024-011", requiresPrescription: true },
      { name: "Enalapril 10mg", genericName: "Enalapril Maleate", category: "Cardiovascular", costPrice: 2.5, sellingPrice: 4.5, quantity: 90, reorderLevel: 25, unit: "Tablets", expiryDate: "2026-12-31", requiresPrescription: true },
      // Antidiabetics
      { name: "Metformin 500mg", genericName: "Metformin HCl", category: "Endocrine & Metabolic", costPrice: 2.0, sellingPrice: 3.5, quantity: 200, reorderLevel: 50, unit: "Tablets", expiryDate: "2027-01-15", batchNumber: "MFM-2024-006", requiresPrescription: true },
      { name: "Glibenclamide 5mg", genericName: "Glibenclamide", category: "Endocrine & Metabolic", costPrice: 1.5, sellingPrice: 2.8, quantity: 150, reorderLevel: 40, unit: "Tablets", expiryDate: "2026-10-30", requiresPrescription: true },
      // Vitamins
      { name: "Vitamin C 500mg", genericName: "Ascorbic Acid", category: "Vitamins & Supplements", costPrice: 1.0, sellingPrice: 2.0, quantity: 500, reorderLevel: 100, unit: "Tablets", expiryDate: "2027-06-30", batchNumber: "VTC-2024-008", requiresPrescription: false },
      { name: "Folic Acid 5mg", genericName: "Folic Acid", category: "Vitamins & Supplements", costPrice: 0.8, sellingPrice: 1.5, quantity: 300, reorderLevel: 60, unit: "Tablets", expiryDate: "2027-03-31", requiresPrescription: false },
      { name: "Zinc Sulphate 20mg", genericName: "Zinc Sulphate Monohydrate", category: "Vitamins & Supplements", costPrice: 1.2, sellingPrice: 2.2, quantity: 5, reorderLevel: 40, unit: "Tablets", expiryDate: "2026-08-01", requiresPrescription: false },
      // GI
      { name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Gastrointestinal", costPrice: 2.5, sellingPrice: 4.5, quantity: 100, reorderLevel: 30, unit: "Capsules", expiryDate: "2026-11-15", batchNumber: "OMP-2024-004", requiresPrescription: false },
      { name: "ORS Sachet", genericName: "Oral Rehydration Salts", category: "Gastrointestinal", costPrice: 0.5, sellingPrice: 1.2, quantity: 400, reorderLevel: 100, unit: "Sachets", expiryDate: "2027-12-31", requiresPrescription: false },
      // Respiratory
      { name: "Salbutamol Inhaler", genericName: "Salbutamol Sulphate", category: "Respiratory", costPrice: 12.0, sellingPrice: 20.0, quantity: 15, reorderLevel: 8, unit: "Inhalers", expiryDate: "2025-12-31", batchNumber: "SAL-2024-010", requiresPrescription: false },
      // Near-expiry
      { name: "Chloroquine 250mg", genericName: "Chloroquine Phosphate", category: "Antimalarials", costPrice: 2.0, sellingPrice: 3.5, quantity: 60, reorderLevel: 20, unit: "Tablets", expiryDate: "2026-04-01", requiresPrescription: false },
    ];

    const invItemIds: string[] = [];
    for (const item of inv1Items) {
      const id = await ctx.db.insert("inventoryItems", {
        pharmacyId: ph1Id,
        name: item.name,
        genericName: item.genericName,
        category: item.category,
        supplierName: "Ernest Chemist Ltd",
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        unit: item.unit,
        expiryDate: item.expiryDate,
        batchNumber: item.batchNumber,
        description: undefined,
        storageCondition: item.storageCondition,
        requiresPrescription: item.requiresPrescription,
        isActive: true,
        createdAt: now - 30 * DAY,
        updatedAt: now - 1 * DAY,
      });
      invItemIds.push(id);
    }

    // Sales for Workspace 1 — 25 realistic sales over the last 7 days
    const saleTemplates = [
      { items: [{ idx: 0, qty: 2 }, { idx: 6, qty: 1 }], payment: "cash" as const, customer: "Kweku Aidoo" },
      { items: [{ idx: 3, qty: 1 }, { idx: 0, qty: 1 }], payment: "mobile_money" as const, customer: "Adwoa Frimpong" },
      { items: [{ idx: 7, qty: 2 }], payment: "cash" as const },
      { items: [{ idx: 9, qty: 1 }, { idx: 10, qty: 1 }, { idx: 16, qty: 1 }], payment: "card" as const, customer: "Yaw Asomah" },
      { items: [{ idx: 14, qty: 3 }, { idx: 13, qty: 2 }], payment: "cash" as const },
      { items: [{ idx: 5, qty: 1 }, { idx: 6, qty: 2 }], payment: "mobile_money" as const, customer: "Efua Bonsu" },
      { items: [{ idx: 17, qty: 5 }, { idx: 0, qty: 1 }], payment: "cash" as const },
      { items: [{ idx: 11, qty: 1 }, { idx: 12, qty: 1 }], payment: "cash" as const, customer: "Kofi Twum" },
      { items: [{ idx: 18, qty: 1 }], payment: "card" as const },
      { items: [{ idx: 1, qty: 2 }, { idx: 4, qty: 1 }], payment: "mobile_money" as const },
      { items: [{ idx: 0, qty: 3 }, { idx: 16, qty: 1 }], payment: "cash" as const, customer: "Ama Serwaa" },
      { items: [{ idx: 7, qty: 1 }, { idx: 8, qty: 1 }], payment: "cash" as const },
      { items: [{ idx: 3, qty: 2 }, { idx: 5, qty: 1 }], payment: "mobile_money" as const, customer: "Kwesi Annan" },
      { items: [{ idx: 13, qty: 1 }, { idx: 14, qty: 2 }], payment: "cash" as const },
      { items: [{ idx: 9, qty: 2 }], payment: "card" as const, customer: "Nana Akua" },
      { items: [{ idx: 0, qty: 1 }, { idx: 6, qty: 3 }], payment: "cash" as const },
      { items: [{ idx: 16, qty: 2 }, { idx: 17, qty: 3 }], payment: "mobile_money" as const },
      { items: [{ idx: 11, qty: 2 }, { idx: 12, qty: 2 }], payment: "cash" as const, customer: "Abena Tuffour" },
      { items: [{ idx: 4, qty: 1 }, { idx: 5, qty: 1 }], payment: "cash" as const },
      { items: [{ idx: 7, qty: 3 }, { idx: 0, qty: 2 }], payment: "mobile_money" as const, customer: "Kwame Asare" },
      { items: [{ idx: 18, qty: 1 }, { idx: 14, qty: 1 }], payment: "card" as const },
      { items: [{ idx: 3, qty: 1 }, { idx: 6, qty: 2 }], payment: "cash" as const },
      { items: [{ idx: 9, qty: 1 }, { idx: 16, qty: 1 }], payment: "mobile_money" as const },
      { items: [{ idx: 0, qty: 4 }], payment: "cash" as const, customer: "Adjoa Opoku" },
      { items: [{ idx: 11, qty: 1 }, { idx: 13, qty: 1 }], payment: "cash" as const },
    ];

    const cashiers = [
      { id: kofiId, name: "Kofi Mensah" },
      { id: amaId, name: "Ama Asante" },
    ];

    for (let i = 0; i < saleTemplates.length; i++) {
      const tpl = saleTemplates[i];
      if (!tpl) continue;

      const daysAgo = Math.floor(i / 4); // ~4 sales/day over 7 days
      const saleTime = now - daysAgo * DAY - Math.floor(Math.random() * 6 * 3600000);
      const cashier = cashiers[i % cashiers.length]!;

      const saleItemsData = tpl.items
        .map(({ idx, qty }) => {
          const inv = inv1Items[idx];
          if (!inv) return null;
          return {
            inventoryItemId: invItemIds[idx]!,
            itemName: inv.name,
            quantity: qty,
            unitPrice: inv.sellingPrice,
            costPrice: inv.costPrice,
            subtotal: inv.sellingPrice * qty,
          };
        })
        .filter(Boolean) as Array<{
          inventoryItemId: string;
          itemName: string;
          quantity: number;
          unitPrice: number;
          costPrice: number;
          subtotal: number;
        }>;

      const subtotal = saleItemsData.reduce((s, si) => s + si.subtotal, 0);
      const total = subtotal;
      const amountPaid = total + (tpl.payment === "cash" ? Math.ceil(total / 5) * 5 - total : 0);

      const saleId = await ctx.db.insert("sales", {
        pharmacyId: ph1Id,
        receiptNumber: generateReceiptNumber(i),
        cashierId: cashier.id,
        cashierName: cashier.name,
        paymentMethod: tpl.payment,
        subtotal,
        discount: 0,
        total,
        amountPaid,
        change: amountPaid - total,
        customerName: tpl.customer,
        status: "completed",
        createdAt: saleTime,
      });

      for (const si of saleItemsData) {
        await ctx.db.insert("saleItems", {
          saleId,
          pharmacyId: ph1Id,
          inventoryItemId: si.inventoryItemId as any,
          itemName: si.itemName,
          quantity: si.quantity,
          unitPrice: si.unitPrice,
          costPrice: si.costPrice,
          subtotal: si.subtotal,
        });
      }
    }

    // Activity logs for Workspace 1
    const activityEntries = [
      { action: "Added drug to inventory", entity: "inventory", details: "Panadol Extra (240 tablets)" },
      { action: "Updated selling price", entity: "inventory", details: "Ibuprofen 400mg: GHS 3.20 → 3.50" },
      { action: "Added staff member", entity: "users", details: "Abena Darko (Pharmacist)" },
      { action: "Updated pharmacy settings", entity: "settings", details: "Expiry alert threshold: 60 days" },
      { action: "Processed sale", entity: "sales", details: "Receipt #RCP-000003, GHS 28.00" },
      { action: "Low stock alert", entity: "inventory", details: "Ibuprofen 400mg below reorder level" },
    ];

    for (let i = 0; i < activityEntries.length; i++) {
      const entry = activityEntries[i]!;
      await ctx.db.insert("activityLogs", {
        pharmacyId: ph1Id,
        userId: kwameId,
        userName: "Kwame Owusu",
        action: entry.action,
        entity: entry.entity,
        details: entry.details,
        createdAt: now - (activityEntries.length - i) * 3 * DAY,
      });
    }

    // ════════════════════════════════════════════════════════════
    // WORKSPACE 2 — LifeCare Pharmacy, Kumasi
    // ════════════════════════════════════════════════════════════
    const ph2Id = generatePharmacyId();

    await ctx.db.insert("pharmacies", {
      pharmacyId: ph2Id,
      name: "LifeCare Pharmacy",
      ownerName: "Adjoa Boateng",
      email: "adjoa.boateng@lifecare.gh",
      phone: "+233 32 204 5678",
      location: "Adum Commercial Area, Osei Street",
      town: "Kumasi",
      licenseNumber: "PMRB-0142-2023",
      displayName: "LifeCare",
      isActive: true,
      createdAt: now - 90 * DAY,
    });

    await ctx.db.insert("pharmacySettings", {
      pharmacyId: ph2Id,
      lowStockAlertDays: 30,
      expiryAlertDays: 45,
      currency: "GHS",
      timezone: "Africa/Accra",
      taxRate: 0,
      receiptFooter: "LifeCare — Your health, our priority. Call us: +233 32 204 5678",
      enableLowStockAlerts: true,
      enableExpiryAlerts: true,
      enableSalesReports: true,
    });

    const adjoadId = await ctx.db.insert("users", {
      pharmacyId: ph2Id,
      name: "Adjoa Boateng",
      email: "adjoa.boateng@lifecare.gh",
      passwordHash,
      role: "owner",
      isActive: true,
      createdAt: now - 90 * DAY,
    });

    await ctx.db.insert("users", {
      pharmacyId: ph2Id,
      name: "Yaw Ampem",
      email: "yaw.ampem@lifecare.gh",
      passwordHash,
      role: "pharmacist",
      isActive: true,
      createdAt: now - 60 * DAY,
    });

    await ctx.db.insert("users", {
      pharmacyId: ph2Id,
      name: "Serwaa Asante",
      email: "serwaa.asante@lifecare.gh",
      passwordHash,
      role: "cashier",
      isActive: true,
      createdAt: now - 30 * DAY,
    });

    // Inventory for Workspace 2 — different product mix, different theme testing
    const inv2Items = [
      { name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesics & Pain Relief", costPrice: 1.2, sellingPrice: 2.5, quantity: 600, reorderLevel: 100, unit: "Tablets", expiryDate: "2027-01-31", requiresPrescription: false },
      { name: "Coartem 80/480mg", genericName: "Artemether/Lumefantrine", category: "Antimalarials", costPrice: 8.5, sellingPrice: 15.0, quantity: 80, reorderLevel: 25, unit: "Tablets", expiryDate: "2026-09-30", requiresPrescription: false },
      { name: "Amoxicillin 250mg", genericName: "Amoxicillin Trihydrate", category: "Antibiotics", costPrice: 2.5, sellingPrice: 4.5, quantity: 0, reorderLevel: 30, unit: "Capsules", expiryDate: "2026-05-31", requiresPrescription: true },
      { name: "Lisinopril 10mg", genericName: "Lisinopril", category: "Cardiovascular", costPrice: 2.8, sellingPrice: 5.0, quantity: 120, reorderLevel: 30, unit: "Tablets", expiryDate: "2027-03-31", requiresPrescription: true },
      { name: "Vitamin B Complex", genericName: "B1, B2, B3, B6, B12", category: "Vitamins & Supplements", costPrice: 1.5, sellingPrice: 3.0, quantity: 250, reorderLevel: 60, unit: "Tablets", expiryDate: "2027-08-31", requiresPrescription: false },
      { name: "Doxycycline 100mg", genericName: "Doxycycline Hyclate", category: "Antibiotics", costPrice: 3.0, sellingPrice: 5.5, quantity: 12, reorderLevel: 20, unit: "Capsules", expiryDate: "2025-11-30", requiresPrescription: true },
      { name: "Cetirizine 10mg", genericName: "Cetirizine HCl", category: "Antihistamines", costPrice: 1.0, sellingPrice: 2.0, quantity: 200, reorderLevel: 50, unit: "Tablets", expiryDate: "2026-12-31", requiresPrescription: false },
      { name: "Ibuprofen Syrup 200mg/5ml", genericName: "Ibuprofen", category: "Analgesics & Pain Relief", costPrice: 4.0, sellingPrice: 7.0, quantity: 40, reorderLevel: 15, unit: "Bottles", expiryDate: "2026-04-30", requiresPrescription: false },
      { name: "ORS Sachets", genericName: "Oral Rehydration Salts", category: "Gastrointestinal", costPrice: 0.5, sellingPrice: 1.2, quantity: 300, reorderLevel: 80, unit: "Sachets", expiryDate: "2028-01-31", requiresPrescription: false },
      { name: "Chlorphenamine 4mg", genericName: "Chlorphenamine Maleate", category: "Antihistamines", costPrice: 0.8, sellingPrice: 1.5, quantity: 180, reorderLevel: 40, unit: "Tablets", expiryDate: "2026-10-31", requiresPrescription: false },
    ];

    for (const item of inv2Items) {
      await ctx.db.insert("inventoryItems", {
        pharmacyId: ph2Id,
        name: item.name,
        genericName: item.genericName,
        category: item.category,
        supplierName: "Kinapharma Ltd",
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        unit: item.unit,
        expiryDate: item.expiryDate,
        requiresPrescription: item.requiresPrescription,
        isActive: true,
        createdAt: now - 20 * DAY,
        updatedAt: now,
      });
    }

    return {
      message: "Seed data created successfully.",
      skipped: false,
      workspace1: {
        pharmacyId: ph1Id,
        name: "MedServe Pharmacy",
        credentials: [
          { email: "kwame.owusu@medserve.gh", role: "owner", password: DEMO_PASSWORD },
          { email: "ama.asante@medserve.gh", role: "admin", password: DEMO_PASSWORD },
          { email: "kofi.mensah@medserve.gh", role: "cashier", password: DEMO_PASSWORD },
        ],
      },
      workspace2: {
        pharmacyId: ph2Id,
        name: "LifeCare Pharmacy",
        credentials: [
          { email: "adjoa.boateng@lifecare.gh", role: "owner", password: DEMO_PASSWORD },
          { email: "yaw.ampem@lifecare.gh", role: "pharmacist", password: DEMO_PASSWORD },
        ],
      },
    };
  },
});
