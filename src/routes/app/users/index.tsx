import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AddUserDialog } from './-components/AddUserDialog'
import { UsersTable, User } from './-components/UsersTable'
import { SearchFilterBar } from './-components/SearchFilterBar'
import { UserStats } from './-components/UserStats'

export const Route = createFileRoute('/app/users/')({
  component: UsersPage,
})

function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'Dr. Samuel Osei',
      email: 'samuel.osei@drugsmart.com',
      role: 'owner',
      status: 'active',
      lastActive: '2026-02-15T14:30:00',
    },
    {
      id: '2',
      name: 'Sarah Mensah',
      email: 'sarah.m@drugsmart.com',
      role: 'manager',
      status: 'active',
      lastActive: '2026-02-15T09:15:00',
    },
    {
      id: '3',
      name: 'Kwame Boateng',
      email: 'kwame.b@drugsmart.com',
      role: 'cashier',
      status: 'active',
      lastActive: '2026-02-15T16:45:00',
    },
    {
      id: '4',
      name: 'Ama Serwaa',
      email: 'ama.s@drugsmart.com',
      role: 'cashier',
      status: 'inactive',
      lastActive: '2026-02-14T17:00:00',
    },
    {
      id: '5',
      name: 'John Koomson',
      email: 'john.k@drugsmart.com',
      role: 'stock-keeper',
      status: 'active',
      lastActive: '2026-02-15T11:20:00',
    },
    {
      id: '6',
      name: 'Emmanuel Tetteh',
      email: 'emmanuel.t@drugsmart.com',
      role: 'cashier',
      status: 'suspended',
      lastActive: '2026-02-10T10:00:00',
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    roles: {
      owner: users.filter((u) => u.role === 'owner').length,
      manager: users.filter((u) => u.role === 'manager').length,
      cashier: users.filter((u) => u.role === 'cashier').length,
      stock_keeper: users.filter((u) => u.role === 'stock-keeper').length,
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage system access and user roles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AddUserDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <UserStats stats={stats} />

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      {/* Users Table */}
      <UsersTable users={filteredUsers} />
    </div>
  )
}
