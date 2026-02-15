import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'
import { StatsCards } from './-components/StatsCards'
import { SearchFilterBar } from './-components/SearchFilterBar'
import { AddDrugDialog } from './-components/AddDrugDialog'
import { InventoryTable, Drug } from './-components/InventoryTable'

export const Route = createFileRoute('/app/inventory/')({
  component: InventoryPage,
})

function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock data
  const drugs: Drug[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Analgesics',
      quantity: 150,
      costPrice: 1.5,
      sellingPrice: 2.5,
      expiryDate: '2025-12-31',
      supplier: 'PharmaCorp Ltd',
      status: 'in-stock',
    },
    {
      id: '2',
      name: 'Amoxicillin Syrup',
      category: 'Antibiotics',
      quantity: 8,
      costPrice: 10.0,
      sellingPrice: 15.0,
      expiryDate: '2024-06-15',
      supplier: 'MediSupply Ghana',
      status: 'low-stock',
    },
    {
      id: '3',
      name: 'Ibuprofen 400mg',
      category: 'Analgesics',
      quantity: 200,
      costPrice: 2.0,
      sellingPrice: 4.0,
      expiryDate: '2026-03-20',
      supplier: 'PharmaCorp Ltd',
      status: 'in-stock',
    },
    {
      id: '4',
      name: 'Vitamin C 1000mg',
      category: 'Vitamins',
      quantity: 45,
      costPrice: 20.0,
      sellingPrice: 35.0,
      expiryDate: '2024-04-10',
      supplier: 'HealthPlus Distributors',
      status: 'expiring-soon',
    },
    {
      id: '5',
      name: 'Cough Syrup',
      category: 'Respiratory',
      quantity: 0,
      costPrice: 8.0,
      sellingPrice: 12.0,
      expiryDate: '2025-08-25',
      supplier: 'MediSupply Ghana',
      status: 'out-of-stock',
    },
    {
      id: '6',
      name: 'Omeprazole 20mg',
      category: 'Digestive',
      quantity: 120,
      costPrice: 1.8,
      sellingPrice: 3.0,
      expiryDate: '2025-11-30',
      supplier: 'PharmaCorp Ltd',
      status: 'in-stock',
    },
    {
      id: '7',
      name: 'Cetirizine 10mg',
      category: 'Antihistamines',
      quantity: 85,
      costPrice: 3.5,
      sellingPrice: 5.5,
      expiryDate: '2025-09-15',
      supplier: 'PharmaCorp Ltd',
      status: 'in-stock',
    },
    {
      id: '8',
      name: 'Multivitamin Tablets',
      category: 'Vitamins',
      quantity: 12,
      costPrice: 25.0,
      sellingPrice: 45.0,
      expiryDate: '2024-05-20',
      supplier: 'HealthPlus Distributors',
      status: 'low-stock',
    },
  ]

  const filteredDrugs = drugs.filter(
    (drug) =>
      (selectedCategory === 'all' || drug.category === selectedCategory) &&
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: drugs.length,
    inStock: drugs.filter((d) => d.status === 'in-stock').length,
    lowStock: drugs.filter((d) => d.status === 'low-stock').length,
    expiringSoon: drugs.filter((d) => d.status === 'expiring-soon').length,
    outOfStock: drugs.filter((d) => d.status === 'out-of-stock').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your pharmacy stock and monitor drug levels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-2 hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-2 hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <AddDrugDialog
            isOpen={isAddDialogOpen}
            setIsOpen={setIsAddDialogOpen}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Inventory Table */}
      <InventoryTable drugs={filteredDrugs} />
    </div>
  )
}
