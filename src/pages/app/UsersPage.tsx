import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatDate, initials } from "@/lib/utils";
import { ROLE_LABELS, type UserRole } from "@/types";
import type { Id } from "@convex/_generated/dataModel";
import { Plus, Users, Search, ShieldCheck, Eye, EyeOff, UserX, UserCheck } from "lucide-react";

const ASSIGNABLE_ROLES: Array<{ value: Exclude<UserRole, "owner">; label: string; description: string }> = [
  { value: "admin", label: "Administrator", description: "Full access except owner-only actions" },
  { value: "cashier", label: "Cashier", description: "Process sales and view inventory" },
  { value: "pharmacist", label: "Pharmacist", description: "Drug intelligence and inventory view" },
  { value: "inventory_manager", label: "Inventory Manager", description: "Manage stock and suppliers" },
];

const roleVariant: Record<UserRole, "brand" | "teal" | "info" | "success" | "warning"> = {
  owner: "brand",
  admin: "teal",
  cashier: "info",
  pharmacist: "success",
  inventory_manager: "warning",
};

export default function UsersPage() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId ?? "";

  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "cashier" as Exclude<UserRole, "owner"> });

  const { toast } = useToast();

  const users = useQuery(api.users.list, { pharmacyId });
  const stats = useQuery(api.users.getStats, { pharmacyId });

  const addStaff = useMutation(api.users.addStaff);
  const toggleActive = useMutation(api.users.toggleActive);
  const updateRole = useMutation(api.users.updateRole);

  const filteredUsers = (users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStaff = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast({ variant: "destructive", title: "All fields are required" });
      return;
    }
    if (form.password.length < 8) {
      toast({ variant: "destructive", title: "Password must be at least 8 characters" });
      return;
    }
    setIsSubmitting(true);
    try {
      await addStaff({ pharmacyId, name: form.name, email: form.email, password: form.password, role: form.role });
      toast({ title: "Staff member added", description: `${form.name} has been added to your workspace.` });
      setShowAddDialog(false);
      setForm({ name: "", email: "", password: "", role: "cashier" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to add staff", description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (userId: string, currentState: boolean, name: string) => {
    try {
      await toggleActive({ userId: userId as Id<"users">, isActive: !currentState });
      toast({ title: `${name} ${!currentState ? "activated" : "deactivated"}` });
    } catch {
      toast({ variant: "destructive", title: "Failed to update user status" });
    }
  };

  const handleRoleChange = async (userId: string, newRole: Exclude<UserRole, "owner">, name: string) => {
    try {
      await updateRole({ userId: userId as Id<"users">, role: newRole });
      toast({ title: "Role updated", description: `${name} is now a ${ROLE_LABELS[newRole]}` });
    } catch {
      toast({ variant: "destructive", title: "Failed to update role" });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage staff access and roles for your pharmacy workspace
          </p>
        </div>
        {["owner", "admin"].includes(user?.role ?? "") && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Add Staff Member
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Users", value: stats?.total ?? 0 },
          { label: "Active", value: stats?.active ?? 0 },
          { label: "Inactive", value: stats?.inactive ?? 0 },
          { label: "Owners / Admins", value: (stats?.byRole?.["owner"] ?? 0) + (stats?.byRole?.["admin"] ?? 0) },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search staff by name or email…"
          startIcon={<Search />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                {["owner", "admin"].includes(user?.role ?? "") && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{search ? "No users match your search" : "No staff members yet"}</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentUser = u._id === user?.id;
                  const isOwner = u.role === "owner";
                  const canEdit = !isCurrentUser && !isOwner && ["owner", "admin"].includes(user?.role ?? "");

                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{initials(u.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{u.name}</p>
                              {isCurrentUser && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">You</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {canEdit ? (
                          <Select
                            value={u.role}
                            onValueChange={(v) => handleRoleChange(u._id, v as Exclude<UserRole, "owner">, u.name)}
                          >
                            <SelectTrigger className="h-8 w-40 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ASSIGNABLE_ROLES.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                  {r.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={roleVariant[u.role]} className="text-xs">
                            {isOwner && <ShieldCheck className="w-3 h-3 mr-1" />}
                            {ROLE_LABELS[u.role]}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Badge variant={u.isActive ? "success" : "secondary"}>
                          {u.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground text-xs">
                        {formatDate(u.createdAt)}
                      </td>
                      {["owner", "admin"].includes(user?.role ?? "") && (
                        <td>
                          {canEdit ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="flex items-center gap-1.5">
                                <Switch
                                  checked={u.isActive}
                                  onCheckedChange={() => handleToggleActive(u._id, u.isActive, u.name)}
                                  className="scale-75"
                                />
                                {u.isActive
                                  ? <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  : <UserX className="w-3.5 h-3.5 text-muted-foreground" />}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground text-right block">
                              {isOwner ? "Owner" : "You"}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Create a new account for a staff member. They will use your Pharmacy ID + their email + password to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input placeholder="e.g. Ama Asante" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address *</Label>
              <Input type="email" placeholder="staff@pharmacy.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v as typeof form.role }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div>
                        <p className="font-medium">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Initial Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Staff should change this password on first login</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddStaff} disabled={isSubmitting}>
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Add Staff Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
