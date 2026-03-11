import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatCurrency, formatDate, daysUntilExpiry } from "@/lib/utils";
import { DRUG_CATEGORIES, PERMISSIONS } from "@/types";
import type { Id } from "@convex/_generated/dataModel";
import {
  Plus, Search, Filter, Package, AlertTriangle, Clock,
  Edit, Trash2, ChevronDown, RefreshCw, Eye,
} from "lucide-react";

const UNITS = ["Tablets", "Capsules", "Bottles", "Vials", "Ampoules", "Sachets", "Tubes", "Patches", "Drops", "Inhalers", "Packs", "Units"];

interface DrugFormData {
  name: string;
  genericName: string;
  category: string;
  supplierName: string;
  costPrice: string;
  sellingPrice: string;
  quantity: string;
  reorderLevel: string;
  unit: string;
  expiryDate: string;
  batchNumber: string;
  description: string;
  storageCondition: string;
  requiresPrescription: boolean;
}

const emptyForm: DrugFormData = {
  name: "",
  genericName: "",
  category: "",
  supplierName: "",
  costPrice: "",
  sellingPrice: "",
  quantity: "",
  reorderLevel: "10",
  unit: "Tablets",
  expiryDate: "",
  batchNumber: "",
  description: "",
  storageCondition: "",
  requiresPrescription: false,
};

function StockBadge({ qty, reorderLevel }: { qty: number; reorderLevel: number }) {
  if (qty === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (qty <= reorderLevel) return <Badge variant="warning">Low Stock</Badge>;
  return <Badge variant="success">In Stock</Badge>;
}

function ExpiryBadge({ expiryDate }: { expiryDate?: string }) {
  if (!expiryDate) return null;
  const days = daysUntilExpiry(expiryDate);
  if (days <= 0) return <Badge variant="danger">Expired</Badge>;
  if (days <= 30) return <Badge variant="danger">{days}d left</Badge>;
  if (days <= 90) return <Badge variant="warning">{days}d left</Badge>;
  return <span className="text-xs text-muted-foreground">{formatDate(expiryDate)}</span>;
}

export default function InventoryPage() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId ?? "";
  const canManage = PERMISSIONS.canManageInventory(user?.role ?? "cashier");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out" | "expiring">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DrugFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = useQuery(api.inventory.list, {
    pharmacyId,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    search: search || undefined,
  });
  const stats = useQuery(api.inventory.getStats, { pharmacyId });
  const categories = useQuery(api.inventory.getCategories, { pharmacyId });

  const addItem = useMutation(api.inventory.add);
  const updateItem = useMutation(api.inventory.update);
  const deactivateItem = useMutation(api.inventory.deactivate);

  const setField = (field: keyof DrugFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowAddDialog(true); };

  const openEdit = (item: NonNullable<typeof items>[0]) => {
    setForm({
      name: item.name,
      genericName: item.genericName ?? "",
      category: item.category,
      supplierName: item.supplierName ?? "",
      costPrice: String(item.costPrice),
      sellingPrice: String(item.sellingPrice),
      quantity: String(item.quantity),
      reorderLevel: String(item.reorderLevel),
      unit: item.unit,
      expiryDate: item.expiryDate ?? "",
      batchNumber: item.batchNumber ?? "",
      description: item.description ?? "",
      storageCondition: item.storageCondition ?? "",
      requiresPrescription: item.requiresPrescription,
    });
    setEditingId(item._id);
    setShowAddDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("Drug name is required", { description: "Please enter the name of the drug before saving." }); return; }
    if (!form.category) { toast.error("Category is required", { description: "Please select a drug category before saving." }); return; }
    if (!form.sellingPrice || isNaN(Number(form.sellingPrice))) { toast.error("Invalid selling price", { description: "Please enter a valid selling price greater than zero." }); return; }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateItem({
          id: editingId as Id<"inventoryItems">,
          name: form.name,
          genericName: form.genericName || undefined,
          category: form.category,
          supplierName: form.supplierName || undefined,
          costPrice: Number(form.costPrice) || 0,
          sellingPrice: Number(form.sellingPrice),
          quantity: Number(form.quantity) || 0,
          reorderLevel: Number(form.reorderLevel) || 10,
          unit: form.unit,
          expiryDate: form.expiryDate || undefined,
          batchNumber: form.batchNumber || undefined,
          description: form.description || undefined,
          storageCondition: form.storageCondition || undefined,
          requiresPrescription: form.requiresPrescription,
        });
        toast.success("Drug updated", { description: `${form.name} has been updated.` });
      } else {
        await addItem({
          pharmacyId,
          name: form.name,
          genericName: form.genericName || undefined,
          category: form.category,
          supplierName: form.supplierName || undefined,
          costPrice: Number(form.costPrice) || 0,
          sellingPrice: Number(form.sellingPrice),
          quantity: Number(form.quantity) || 0,
          reorderLevel: Number(form.reorderLevel) || 10,
          unit: form.unit,
          expiryDate: form.expiryDate || undefined,
          batchNumber: form.batchNumber || undefined,
          description: form.description || undefined,
          storageCondition: form.storageCondition || undefined,
          requiresPrescription: form.requiresPrescription,
        });
        toast.success("Drug added", { description: `${form.name} has been added to inventory.` });
      }
      setShowAddDialog(false);
    } catch (err) {
      toast.error(editingId ? "Couldn't update drug" : "Couldn't add drug", { description: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from inventory?`)) return;
    try {
      await deactivateItem({ id: id as Id<"inventoryItems"> });
      toast.success("Item removed", { description: `${name} has been removed from inventory.` });
    } catch {
      toast.error("Couldn't remove item", { description: "Something went wrong. Please try again." });
    }
  };

  // Apply stock/expiry filter
  const filteredItems = (items ?? []).filter((item) => {
    if (stockFilter === "low") return item.quantity > 0 && item.quantity <= item.reorderLevel;
    if (stockFilter === "out") return item.quantity === 0;
    if (stockFilter === "expiring") {
      if (!item.expiryDate) return false;
      const days = daysUntilExpiry(item.expiryDate);
      return days <= 60;
    }
    return true;
  });

  const emptyState = (
    <div className="text-center py-14 text-muted-foreground">
      <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
      <p className="text-sm">
        {search || categoryFilter !== "all" || stockFilter !== "all"
          ? "No items match your filters"
          : "No inventory items yet. Add your first drug."}
      </p>
      {canManage && !search && categoryFilter === "all" && (
        <Button size="sm" className="mt-3" onClick={openAdd}>
          <Plus className="w-3.5 h-3.5" />
          Add Drug
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stats?.totalItems ?? 0} drugs · Value: {formatCurrency(stats?.totalValue ?? 0)}
          </p>
        </div>
        {canManage && (
          <Button onClick={openAdd} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Drug
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Items", value: stats?.totalItems ?? 0, icon: Package, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
          { label: "Low Stock", value: stats?.lowStock ?? 0, icon: AlertTriangle, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
          { label: "Out of Stock", value: stats?.outOfStock ?? 0, icon: RefreshCw, color: "text-red-600 bg-red-50 dark:bg-red-950/40" },
          { label: "Expiring ≤30d", value: stats?.expiringSoon ?? 0, icon: Clock, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
        ].map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Search drugs…"
          startIcon={<Search />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(categories ?? []).map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as typeof stockFilter)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
            <SelectItem value="expiring">Expiring ≤60d</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Drug Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Expiry</th>
                <th>Status</th>
                {canManage && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 7 : 6}>{emptyState}</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <>
                    <tr key={item._id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}>
                      <td>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          {item.genericName && <p className="text-xs text-muted-foreground">{item.genericName}</p>}
                          {item.requiresPrescription && (
                            <span className="text-[10px] text-violet-600 font-medium">Rx</span>
                          )}
                        </div>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{item.category}</span></td>
                      <td>
                        <span className="font-medium">{item.quantity}</span>
                        <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                      </td>
                      <td className="font-medium">{formatCurrency(item.sellingPrice)}</td>
                      <td><ExpiryBadge expiryDate={item.expiryDate} /></td>
                      <td><StockBadge qty={item.quantity} reorderLevel={item.reorderLevel} /></td>
                      {canManage && (
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); openEdit(item); }}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); handleDeactivate(item._id, item.name); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expandedId === item._id ? "rotate-180" : ""}`} />
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandedId === item._id && (
                      <tr key={`${item._id}-exp`}>
                        <td colSpan={canManage ? 7 : 6} className="bg-muted/30 px-4 py-3">
                          <div className="grid sm:grid-cols-3 gap-4 text-xs">
                            <div>
                              <p className="font-semibold text-muted-foreground mb-1">Pricing</p>
                              <p>Cost: <strong>{formatCurrency(item.costPrice)}</strong></p>
                              <p>Selling: <strong>{formatCurrency(item.sellingPrice)}</strong></p>
                              <p>Margin: <strong>{item.costPrice > 0 ? ((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(1) : "—"}%</strong></p>
                            </div>
                            <div>
                              <p className="font-semibold text-muted-foreground mb-1">Stock Info</p>
                              <p>Reorder at: <strong>{item.reorderLevel} {item.unit}</strong></p>
                              <p>Batch: <strong>{item.batchNumber ?? "—"}</strong></p>
                              <p>Supplier: <strong>{item.supplierName ?? "—"}</strong></p>
                            </div>
                            <div>
                              <p className="font-semibold text-muted-foreground mb-1">Details</p>
                              <p>Storage: <strong>{item.storageCondition ?? "—"}</strong></p>
                              {item.description && <p className="mt-0.5 text-muted-foreground">{item.description}</p>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {filteredItems.length === 0 ? emptyState : filteredItems.map((item) => (
          <div key={item._id} className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Card header — always visible */}
            <button
              className="w-full flex items-start gap-3 p-3.5 text-left"
              onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                    {item.genericName && (
                      <p className="text-xs text-muted-foreground truncate">{item.genericName}</p>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${expandedId === item._id ? "rotate-180" : ""}`} />
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <StockBadge qty={item.quantity} reorderLevel={item.reorderLevel} />
                  <ExpiryBadge expiryDate={item.expiryDate} />
                  <span className="text-xs text-muted-foreground">{item.quantity} {item.unit}</span>
                  <span className="text-xs font-semibold text-foreground">{formatCurrency(item.sellingPrice)}</span>
                </div>
              </div>
            </button>

            {/* Expanded details */}
            {expandedId === item._id && (
              <div className="border-t border-border/60 px-3.5 py-3 bg-muted/30 space-y-2.5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div><span className="text-muted-foreground">Category</span><p className="font-medium">{item.category}</p></div>
                  <div><span className="text-muted-foreground">Cost Price</span><p className="font-medium">{formatCurrency(item.costPrice)}</p></div>
                  <div><span className="text-muted-foreground">Reorder at</span><p className="font-medium">{item.reorderLevel} {item.unit}</p></div>
                  <div><span className="text-muted-foreground">Supplier</span><p className="font-medium truncate">{item.supplierName ?? "—"}</p></div>
                  {item.batchNumber && <div><span className="text-muted-foreground">Batch</span><p className="font-medium">{item.batchNumber}</p></div>}
                  {item.storageCondition && <div className="col-span-2"><span className="text-muted-foreground">Storage</span><p className="font-medium">{item.storageCondition}</p></div>}
                </div>
                {canManage && (
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(item)}>
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-destructive hover:text-destructive border-destructive/30"
                      onClick={() => handleDeactivate(item._id, item.name)}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Drug" : "Add Drug to Inventory"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the drug details below" : "Fill in the details for the new drug"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Basic Info */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Brand / Trade Name *</Label>
                  <Input placeholder="e.g. Panadol" value={form.name} onChange={setField("name")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Generic Name</Label>
                  <Input placeholder="e.g. Paracetamol" value={form.genericName} onChange={setField("genericName")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {DRUG_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Supplier</Label>
                  <Input placeholder="e.g. Ernest Chemist Ltd" value={form.supplierName} onChange={setField("supplierName")} />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pricing & Stock</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Cost Price (GHS)</Label>
                  <Input type="number" placeholder="0.00" min="0" step="0.01" value={form.costPrice} onChange={setField("costPrice")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Selling Price (GHS) *</Label>
                  <Input type="number" placeholder="0.00" min="0" step="0.01" value={form.sellingPrice} onChange={setField("sellingPrice")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity in Stock</Label>
                  <Input type="number" placeholder="0" min="0" value={form.quantity} onChange={setField("quantity")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Reorder Level</Label>
                  <Input type="number" placeholder="10" min="0" value={form.reorderLevel} onChange={setField("reorderLevel")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Unit of Measurement</Label>
                  <Select value={form.unit} onValueChange={(v) => setForm((p) => ({ ...p, unit: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tracking */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tracking & Expiry</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Expiry Date</Label>
                  <Input type="date" value={form.expiryDate} onChange={setField("expiryDate")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Batch Number</Label>
                  <Input placeholder="e.g. BATCH-2024-001" value={form.batchNumber} onChange={setField("batchNumber")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Storage Condition</Label>
                  <Input placeholder="e.g. Store below 25°C" value={form.storageCondition} onChange={setField("storageCondition")} />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <Label>Notes / Description</Label>
                <Textarea placeholder="Any additional notes about this drug…" value={form.description} onChange={setField("description")} />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Checkbox
                  id="requiresPrescription"
                  checked={form.requiresPrescription}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, requiresPrescription: !!v }))}
                />
                <Label htmlFor="requiresPrescription" className="font-normal cursor-pointer">
                  Requires prescription (Rx only)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : editingId ? "Save Changes" : "Add to Inventory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
