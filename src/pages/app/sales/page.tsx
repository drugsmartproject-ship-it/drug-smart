import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { CartItem, PaymentMethod } from "@/types";
import type { Id } from "@convex/_generated/dataModel";
import {
  Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle2,
  CreditCard, Smartphone, Banknote, Clock, Package,
  Printer, RefreshCw, X,
} from "lucide-react";

const PAYMENT_ICONS: Record<PaymentMethod, React.ElementType> = {
  cash: Banknote,
  mobile_money: Smartphone,
  card: CreditCard,
  credit: Clock,
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  mobile_money: "Mobile Money",
  card: "Card",
  credit: "Credit",
};

interface ReceiptData {
  saleId: string;
  receiptNumber: string;
  total: number;
  change: number;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  customerName?: string;
  cashierName: string;
  timestamp: number;
}

function ReceiptModal({ receipt, onClose }: { receipt: ReceiptData; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            Sale Completed
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Receipt */}
          <div className="bg-muted/50 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-center mb-3">
              <p className="text-base font-bold">DrugSmart</p>
              <p className="text-muted-foreground">Transaction Receipt</p>
            </div>
            <div className="flex justify-between">
              <span>Receipt #</span>
              <span className="font-bold">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{formatDateTime(receipt.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier</span>
              <span>{receipt.cashierName}</span>
            </div>
            {receipt.customerName && (
              <div className="flex justify-between">
                <span>Customer</span>
                <span>{receipt.customerName}</span>
              </div>
            )}
            <Separator className="my-2" />
            {receipt.items.map((item) => (
              <div key={item.inventoryItemId}>
                <p className="font-medium">{item.itemName}</p>
                <div className="flex justify-between text-muted-foreground">
                  <span>{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                  <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
                </div>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-sm">
              <span>TOTAL</span>
              <span>{formatCurrency(receipt.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment ({PAYMENT_LABELS[receipt.paymentMethod]})</span>
            </div>
            {receipt.change > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Change</span>
                <span>{formatCurrency(receipt.change)}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button className="flex-1" onClick={onClose}>
              New Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SalesPage() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId ?? "";

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [discount, setDiscount] = useState("0");
  const [amountPaid, setAmountPaid] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const inventoryItems = useQuery(api.inventory.list, {
    pharmacyId,
    search: search || undefined,
  });

  const recentSales = useQuery(api.sales.list, { pharmacyId, limit: 10 });

  const processSale = useMutation(api.sales.processSale);

  const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discountAmt = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountAmt);
  const change = Math.max(0, (Number(amountPaid) || 0) - total);

  const addToCart = useCallback((item: NonNullable<typeof inventoryItems>[0]) => {
    if (item.quantity === 0) {
      toast.error("Out of stock", { description: `${item.name} has no available stock` });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.inventoryItemId === item._id);
      if (existing) {
        if (existing.quantity >= item.quantity) {
          toast.error("Max quantity reached");
          return prev;
        }
        return prev.map((c) =>
          c.inventoryItemId === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, {
        inventoryItemId: item._id,
        itemName: item.name,
        unitPrice: item.sellingPrice,
        costPrice: item.costPrice,
        quantity: 1,
        maxQuantity: item.quantity,
      }];
    });
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => {
      if (c.inventoryItemId !== id) return c;
      const newQty = Math.max(1, Math.min(c.maxQuantity, c.quantity + delta));
      return { ...c, quantity: newQty };
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.inventoryItemId !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount("0");
    setAmountPaid("");
    setCustomerName("");
  };

  const handleProcessSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (paymentMethod === "cash" && Number(amountPaid) < total) {
      toast.error("Insufficient payment", { description: `Amount paid must be at least ${formatCurrency(total)}` });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processSale({
        pharmacyId,
        cashierId: user!.id as unknown as Id<"users">,
        cashierName: user!.name,
        paymentMethod,
        discount: discountAmt,
        amountPaid: Number(amountPaid) || total,
        customerName: customerName || undefined,
        items: cart.map((c) => ({
          inventoryItemId: c.inventoryItemId as Id<"inventoryItems">,
          itemName: c.itemName,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          costPrice: c.costPrice,
        })),
      });

      setReceipt({
        saleId: result.saleId,
        receiptNumber: result.receiptNumber,
        total: result.total,
        change: result.change,
        items: [...cart],
        paymentMethod,
        customerName: customerName || undefined,
        cashierName: user!.name,
        timestamp: Date.now(),
      });
      clearCart();
    } catch (err) {
      toast.error("Sale failed", { description: err instanceof Error ? err.message : "Could not process sale" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left: Product Search & List */}
      <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold mb-3">Point of Sale</h1>
          <Input
            placeholder="Search drugs to add to cart…"
            startIcon={<Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto p-4">
          {search ? (
            <div className="space-y-2">
              {(inventoryItems ?? []).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No drugs found for "{search}"</p>
                </div>
              ) : (
                (inventoryItems ?? []).map((item) => (
                  <button
                    key={item._id}
                    onClick={() => addToCart(item)}
                    disabled={item.quantity === 0}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category} · {item.quantity} {item.unit}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{formatCurrency(item.sellingPrice)}</p>
                      {item.quantity === 0 && <Badge variant="danger" className="text-[10px]">Out of stock</Badge>}
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            /* Recent Sales */
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent Transactions
              </p>
              {(recentSales ?? []).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No transactions yet</p>
                  <p className="text-xs mt-1">Search for a drug to start a sale</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(recentSales ?? []).map((sale) => (
                    <div key={sale._id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono font-semibold">{sale.receiptNumber}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDateTime(sale.createdAt)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">{formatCurrency(sale.total)}</p>
                        <Badge variant={sale.status === "completed" ? "success" : "danger"} className="text-[10px] px-1.5 py-0">
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart Panel */}
      <div className="w-80 xl:w-96 flex flex-col bg-card">
        {/* Cart Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Cart</span>
            {cart.length > 0 && (
              <Badge variant="brand" className="text-[10px] px-1.5 py-0">{cart.length}</Badge>
            )}
          </div>
          {cart.length > 0 && (
            <Button variant="ghost" size="icon-sm" onClick={clearCart}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Cart is empty</p>
              <p className="text-xs mt-1 text-center">Search and select drugs to add them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.inventoryItemId} className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium leading-tight">{item.itemName}</p>
                    <button onClick={() => removeFromCart(item.inventoryItemId)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.inventoryItemId, -1)}
                        className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.inventoryItemId, 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)} each</p>
                      <p className="text-sm font-bold">{formatCurrency(item.quantity * item.unitPrice)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & Payment */}
        {cart.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            {/* Customer Name */}
            <div className="space-y-1">
              <Label className="text-xs">Customer Name (optional)</Label>
              <Input
                placeholder="Walk-in customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* Discount */}
            <div className="space-y-1">
              <Label className="text-xs">Discount (GHS)</Label>
              <Input
                type="number"
                min="0"
                max={subtotal}
                placeholder="0.00"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <Label className="text-xs">Payment Method</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((pm) => {
                  const Icon = PAYMENT_ICONS[pm];
                  return (
                    <button
                      key={pm}
                      onClick={() => setPaymentMethod(pm)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        paymentMethod === pm
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {PAYMENT_LABELS[pm]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Paid */}
            {paymentMethod === "cash" && (
              <div className="space-y-1">
                <Label className="text-xs">Amount Received (GHS)</Label>
                <Input
                  type="number"
                  min={total}
                  placeholder={formatCurrency(total)}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="h-8 text-xs font-bold"
                />
                {Number(amountPaid) >= total && (
                  <p className="text-xs text-emerald-600 font-medium">
                    Change: {formatCurrency(change)}
                  </p>
                )}
              </div>
            )}

            {/* Totals */}
            <Separator />
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleProcessSale}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Sale · {formatCurrency(total)}
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}
