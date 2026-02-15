import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ShoppingCart,
  Plus,
  Search,
  Trash2,
  CreditCard,
  Banknote,
  Scan,
  Minus,
  User,
  ArrowLeft,
  Filter,
  MoreVertical,
  X,
  ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/app/new-transaction/')({
  component: NewTransactionPage,
})

function NewTransactionPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="flex h-[calc(100vh-theme(spacing.4))] -m-4 md:-m-8 overflow-hidden bg-slate-50/50 relative">
      {/* Main Content: Catalog (Full Width) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <header className="shrink-0 h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Link to="/app/sales">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-slate-400 hover:text-slate-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="relative w-64 md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input
                placeholder="Search products..."
                className="pl-10 h-10 bg-slate-100 border-0 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-slate-500 hover:text-indigo-600 font-medium"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            {/* Cart Trigger Button */}
            <Button
              onClick={() => setIsCartOpen(true)}
              className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-bold text-sm">Cart</span>
              <Badge className="ml-1 bg-white/20 text-white border-0 h-5 px-1.5 min-w-[1.25rem] hover:bg-white/30">
                3
              </Badge>
            </Button>
          </div>
        </header>

        {/* Categories */}
        <div className="shrink-0 h-16 px-6 border-b border-slate-100 bg-white/50 flex items-center gap-3 overflow-x-auto no-scrollbar backdrop-blur-sm">
          {[
            'All Items',
            'Analgesics',
            'Antibiotics',
            'Vitamins',
            'First Aid',
            'Skincare',
            'Daily Care',
            'Generics',
            'Supplements',
          ].map((cat, i) => (
            <button
              key={cat}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all border shadow-sm ${
                i === 0
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10 scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid - Full Width & Larger Cards */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 bg-slate-50/30">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 pb-20">
            {[
              {
                name: 'Paracetamol 500mg',
                cat: 'Analgesic',
                stock: 50,
                price: '2.50',
                color: 'bg-emerald-100/50 text-emerald-700',
              },
              {
                name: 'Amoxicillin Syrup',
                cat: 'Antibiotics',
                stock: 12,
                price: '15.00',
                color: 'bg-blue-100/50 text-blue-700',
              },
              {
                name: 'Ibuprofen 400mg',
                cat: 'Analgesic',
                stock: 120,
                price: '4.00',
                color: 'bg-emerald-100/50 text-emerald-700',
              },
              {
                name: 'Vitamin C 1000mg',
                cat: 'Supplement',
                stock: 45,
                price: '35.00',
                color: 'bg-orange-100/50 text-orange-700',
              },
              {
                name: 'Cough Syrup',
                cat: 'Respiratory',
                stock: 20,
                price: '12.00',
                color: 'bg-indigo-100/50 text-indigo-700',
              },
              {
                name: 'Antacid Liquid',
                cat: 'Digestive',
                stock: 35,
                price: '8.50',
                color: 'bg-pink-100/50 text-pink-700',
              },
              {
                name: 'Bandages (Box)',
                cat: 'First Aid',
                stock: 60,
                price: '10.00',
                color: 'bg-slate-100 text-slate-700',
              },
              {
                name: 'Omeprazole 20mg',
                cat: 'Digestive',
                stock: 100,
                price: '3.00',
                color: 'bg-pink-100/50 text-pink-700',
              },
              {
                name: 'Cetirizine 10mg',
                cat: 'Allergy',
                stock: 85,
                price: '5.50',
                color: 'bg-purple-100/50 text-purple-700',
              },
              {
                name: 'Multivitamin',
                cat: 'Supplement',
                stock: 30,
                price: '45.00',
                color: 'bg-orange-100/50 text-orange-700',
              },
              {
                name: 'Syringes (10ml)',
                cat: 'Medical Supply',
                stock: 200,
                price: '1.50',
                color: 'bg-cyan-100/50 text-cyan-700',
              },
              {
                name: 'Face Masks (50pcs)',
                cat: 'Protection',
                stock: 40,
                price: '25.00',
                color: 'bg-teal-100/50 text-teal-700',
              },
              {
                name: 'Aspirin 81mg',
                cat: 'Analgesic',
                stock: 75,
                price: '6.50',
                color: 'bg-red-100/50 text-red-700',
              },
              {
                name: 'Loratadine',
                cat: 'Allergy',
                stock: 40,
                price: '8.00',
                color: 'bg-purple-100/50 text-purple-700',
              },
              {
                name: 'Zinc 50mg',
                cat: 'Supplement',
                stock: 22,
                price: '18.00',
                color: 'bg-orange-100/50 text-orange-700',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 cursor-pointer h-[180px] relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 w-28 h-28 ${item.color} opacity-10 rounded-bl-[60px] -mr-6 -mt-6 transition-transform group-hover:scale-125 duration-500`}
                />

                <div className="z-10 relative">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="secondary"
                      className="px-2.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 font-bold uppercase tracking-wider border-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm"
                    >
                      {item.cat}
                    </Badge>
                  </div>
                  <div
                    className={`h-14 w-14 rounded-2xl mb-3 ${item.color} flex items-center justify-center shadow-sm`}
                  >
                    <span className="text-2xl font-black opacity-80">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors pr-2">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-end justify-between mt-auto z-10 pt-4 border-t border-slate-50 group-hover:border-indigo-50">
                  <span className="text-xs font-semibold text-slate-400">
                    {item.stock} in stock
                  </span>
                  <span className="text-xl font-black text-slate-900 group-hover:text-indigo-600 tracking-tight">
                    GH₵{item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-in Cart Drawer Overlay */}
      <div
        className={`absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-in Cart Drawer */}
      <aside
        className={`absolute top-0 right-0 bottom-0 z-40 w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cart Header */}
        <div className="shrink-0 h-20 px-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">
                Walk-in Customer
              </p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                Order #8923
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-1"></span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1 font-semibold"
            >
              3 Items
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="h-9 w-9 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50/30">
          {[
            { name: 'Paracetamol 500mg', price: '2.50', qty: 2, total: '5.00' },
            {
              name: 'Amoxicillin Syrup',
              price: '15.00',
              qty: 1,
              total: '15.00',
            },
            { name: 'Antacid Liquid', price: '8.50', qty: 1, total: '8.50' },
            { name: 'Bandages (Box)', price: '10.00', qty: 3, total: '30.00' },
            { name: 'Vitamin C', price: '12.00', qty: 1, total: '12.00' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group relative"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-100 text-lg shadow-inner">
                {item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 text-base truncate pr-2">
                    {item.name}
                  </h4>
                  <span className="font-bold text-slate-900 text-base">
                    GH₵ {item.total}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400 font-medium">
                    GH₵ {item.price} / unit
                  </p>
                  <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1 h-9 shadow-sm">
                    <button className="w-8 h-full flex items-center justify-center hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-700">
                      {item.qty}
                    </span>
                    <button className="w-8 h-full flex items-center justify-center hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button className="absolute -top-2 -right-2 bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Payment Footer */}
        <div className="shrink-0 p-8 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-800 font-bold">GH₵ 70.50</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
              <span>Tax (0%)</span>
              <span className="text-slate-800 font-bold">GH₵ 0.00</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-200">
              <span className="text-base font-bold text-slate-700">
                Total Payable
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-slate-500 translate-y-[-2px]">
                  GH₵
                </span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  70.50
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button
              variant="outline"
              className="h-14 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold rounded-xl transition-all flex flex-col gap-1 items-center justify-center"
            >
              <CreditCard className="h-5 w-5 mb-0.5" />
              <span className="text-xs">Card Payment</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-bold rounded-xl transition-all flex flex-col gap-1 items-center justify-center"
            >
              <Banknote className="h-5 w-5 mb-0.5" />
              <span className="text-xs">Cash Payment</span>
            </Button>
          </div>

          <Button className="w-full h-16 text-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3">
            <span>Charge & Print Receipt</span>
            <ChevronRight className="h-6 w-6 opacity-60" />
          </Button>
        </div>
      </aside>
    </div>
  )
}
