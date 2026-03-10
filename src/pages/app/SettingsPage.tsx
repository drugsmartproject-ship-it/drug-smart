import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABELS } from "@/types";
import {
  Settings, Building2, Bell, Shield, Copy, CheckCircle2,
  Save, Package,
} from "lucide-react";

export default function SettingsPage() {
  const { user, pharmacy } = useAuth();
  const pharmacyId = user?.pharmacyId ?? "";
  const { toast } = useToast();
  const [idCopied, setIdCopied] = useState(false);

  const pharmacyData = useQuery(api.pharmacies.getByPharmacyId, { pharmacyId });
  const settings = useQuery(api.pharmacies.getSettings, { pharmacyId });

  const updateDetails = useMutation(api.pharmacies.updateDetails);
  const updateSettings = useMutation(api.pharmacies.updateSettings);

  const [detailsForm, setDetailsForm] = useState({ name: "", phone: "", location: "", town: "", displayName: "", licenseNumber: "" });
  const [settingsForm, setSettingsForm] = useState({
    expiryAlertDays: 60,
    lowStockAlertDays: 30,
    taxRate: 0,
    receiptFooter: "",
    enableLowStockAlerts: true,
    enableExpiryAlerts: true,
    enableSalesReports: true,
  });

  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (pharmacyData) {
      setDetailsForm({
        name: pharmacyData.name,
        phone: pharmacyData.phone,
        location: pharmacyData.location,
        town: pharmacyData.town,
        displayName: pharmacyData.displayName ?? "",
        licenseNumber: pharmacyData.licenseNumber ?? "",
      });
    }
  }, [pharmacyData]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        expiryAlertDays: settings.expiryAlertDays,
        lowStockAlertDays: settings.lowStockAlertDays,
        taxRate: settings.taxRate,
        receiptFooter: settings.receiptFooter ?? "",
        enableLowStockAlerts: settings.enableLowStockAlerts,
        enableExpiryAlerts: settings.enableExpiryAlerts,
        enableSalesReports: settings.enableSalesReports,
      });
    }
  }, [settings]);

  const canEdit = ["owner", "admin"].includes(user?.role ?? "");

  const handleSaveDetails = async () => {
    setIsSavingDetails(true);
    try {
      await updateDetails({ pharmacyId, ...detailsForm });
      toast({ title: "Pharmacy details updated" });
    } catch {
      toast({ variant: "destructive", title: "Failed to update details" });
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await updateSettings({ pharmacyId, ...settingsForm });
      toast({ title: "Settings saved" });
    } catch {
      toast({ variant: "destructive", title: "Failed to save settings" });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const copyPharmacyId = () => {
    navigator.clipboard.writeText(pharmacyId);
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your pharmacy workspace</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Role</p>
              <Badge variant="brand">{ROLE_LABELS[user?.role ?? "cashier"]}</Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pharmacy ID / Workspace Code</p>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-3 py-1.5 rounded-lg text-sm font-mono font-bold tracking-widest">
                {pharmacyId}
              </code>
              <Button variant="outline" size="sm" onClick={copyPharmacyId}>
                {idCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {idCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Share this ID with staff so they can log in to your workspace</p>
          </div>
        </CardContent>
      </Card>

      {/* Pharmacy Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Pharmacy Details
              </CardTitle>
              <CardDescription className="mt-0.5">Basic information about your pharmacy</CardDescription>
            </div>
            {!canEdit && <Badge variant="secondary">View Only</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Pharmacy Name</Label>
              <Input
                value={detailsForm.name}
                onChange={(e) => setDetailsForm((p) => ({ ...p, name: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Display Name</Label>
              <Input
                value={detailsForm.displayName}
                onChange={(e) => setDetailsForm((p) => ({ ...p, displayName: e.target.value }))}
                disabled={!canEdit}
                placeholder="Shortened name for the workspace"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input
                value={detailsForm.phone}
                onChange={(e) => setDetailsForm((p) => ({ ...p, phone: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Town / City</Label>
              <Input
                value={detailsForm.town}
                onChange={(e) => setDetailsForm((p) => ({ ...p, town: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Location / Address</Label>
              <Input
                value={detailsForm.location}
                onChange={(e) => setDetailsForm((p) => ({ ...p, location: e.target.value }))}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-1.5">
              <Label>License / Registration Number</Label>
              <Input
                value={detailsForm.licenseNumber}
                onChange={(e) => setDetailsForm((p) => ({ ...p, licenseNumber: e.target.value }))}
                disabled={!canEdit}
                placeholder="e.g. PMRB-0001-2024"
              />
            </div>
          </div>
          {canEdit && (
            <div className="flex justify-end">
              <Button onClick={handleSaveDetails} disabled={isSavingDetails} size="sm">
                {isSavingDetails ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Operational Settings */}
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Operational Settings
            </CardTitle>
            <CardDescription>Configure alerts, receipts, and operational preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alerts */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Alert Configuration</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Low Stock Alerts</p>
                    <p className="text-xs text-muted-foreground">Alert when stock reaches reorder level</p>
                  </div>
                  <Switch
                    checked={settingsForm.enableLowStockAlerts}
                    onCheckedChange={(v) => setSettingsForm((p) => ({ ...p, enableLowStockAlerts: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Expiry Date Alerts</p>
                    <p className="text-xs text-muted-foreground">Alert when drugs are nearing expiry</p>
                  </div>
                  <Switch
                    checked={settingsForm.enableExpiryAlerts}
                    onCheckedChange={(v) => setSettingsForm((p) => ({ ...p, enableExpiryAlerts: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sales Reports</p>
                    <p className="text-xs text-muted-foreground">Enable daily and weekly sales summaries</p>
                  </div>
                  <Switch
                    checked={settingsForm.enableSalesReports}
                    onCheckedChange={(v) => setSettingsForm((p) => ({ ...p, enableSalesReports: v }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Thresholds */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Alert Thresholds</p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Expiry Alert (days before)</Label>
                  <Input
                    type="number"
                    min="7"
                    max="365"
                    value={settingsForm.expiryAlertDays}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, expiryAlertDays: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Alert {settingsForm.expiryAlertDays} days before expiry</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Low Stock Alert (days of supply)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    value={settingsForm.lowStockAlertDays}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, lowStockAlertDays: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settingsForm.taxRate}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, taxRate: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">Set to 0 if not applicable</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Receipt */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Receipt Configuration</p>
              <div className="space-y-1.5">
                <Label>Receipt Footer Message</Label>
                <Textarea
                  placeholder="e.g. Thank you for your patronage. Keep drugs out of reach of children."
                  value={settingsForm.receiptFooter}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, receiptFooter: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSavingSettings} size="sm">
                {isSavingSettings ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workspace Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Workspace Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Workspace Name</p>
              <p className="font-medium">{pharmacy?.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Location</p>
              <p className="font-medium">{pharmacyData?.location}, {pharmacyData?.town}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Currency</p>
              <p className="font-medium">GHS — Ghanaian Cedi</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Timezone</p>
              <p className="font-medium">Africa/Accra (GMT+0)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
