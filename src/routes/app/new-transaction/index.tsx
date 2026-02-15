import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ShoppingCart,
  Plus,
  Search,
  CreditCard,
  Banknote,
  Minus,
  User,
  ArrowLeft,
  X,
  Pill,
  Sparkles,
  TrendingUp,
  Clock,
  Package,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/new-transaction/')({
  component: NewTransactionPage,
})

interface CartItem {
  name: string
  price: number
  qty: number
  cat: string
}

interface Product {
  name: string
  cat: string
  stock: number
  price: number
  color: string
  popular?: boolean
}

function NewTransactionPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isCartOpen, setIsCartOpen] = useState(false)

  const categories = [
    { name: 'All', icon: '🏥' },
    { name: 'Analgesics', icon: '💊' },
    { name: 'Antibiotics', icon: '🧪' },
    { name: 'Vitamins', icon: '🌟' },
    { name: 'First Aid', icon: '🩹' },
    { name: 'Supplements', icon: '💪' },
  ]

  const products: Product[] = [
    {
      name: 'Paracetamol 500mg',
      cat: 'Analgesics',
      stock: 50,
      price: 2.5,
      color: 'from-emerald-400 to-teal-500',
      popular: true,
    },
    {
      name: 'Amoxicillin Syrup',
      cat: 'Antibiotics',
      stock: 12,
      price: 15.0,
      color: 'from-blue-400 to-indigo-500',
      popular: true,
    },
    {
      name: 'Ibuprofen 400mg',
      cat: 'Analgesics',
      stock: 120,
      price: 4.0,
      color: 'from-emerald-400 to-green-500',
    },
    {
      name: 'Vitamin C 1000mg',
      cat: 'Vitamins',
      stock: 45,
      price: 35.0,
      color: 'from-orange-400 to-amber-500',
      popular: true,
    },
    {
      name: 'Cough Syrup',
      cat: 'Antibiotics',
      stock: 20,
      price: 12.0,
      color: 'from-purple-400 to-pink-500',
    },
    {
      name: 'Antacid Liquid',
      cat: 'Analgesics',
      stock: 35,
      price: 8.5,
      color: 'from-pink-400 to-rose-500',
    },
    {
      name: 'Bandages (Box)',
      cat: 'First Aid',
      stock: 60,
      price: 10.0,
      color: 'from-slate-400 to-gray-500',
    },
    {
      name: 'Omeprazole 20mg',
      cat: 'Analgesics',
      stock: 100,
      price: 3.0,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      name: 'Cetirizine 10mg',
      cat: 'Analgesics',
      stock: 85,
      price: 5.5,
      color: 'from-violet-400 to-purple-500',
    },
    {
      name: 'Multivitamin',
      cat: 'Vitamins',
      stock: 30,
      price: 45.0,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      name: 'Zinc 50mg',
      cat: 'Supplements',
      stock: 22,
      price: 18.0,
      color: 'from-teal-400 to-cyan-500',
    },
    {
      name: 'Face Masks (50pcs)',
      cat: 'First Aid',
      stock: 40,
      price: 25.0,
      color: 'from-indigo-400 to-blue-500',
    },
  ]

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name)
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (name: string) => {
    setCart((prev) => prev.filter((item) => item.name !== name))
  }

  const updateQty = (name: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.name === name) {
              const newQty = item.qty + delta
              return newQty > 0 ? { ...item, qty: newQty } : null
            }
            return item
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === 'All' || p.cat === selectedCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-gradient-to-br from-slate-50 via-white to-slate-50 -m-4 md:-m-8 overflow-hidden relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/app/sales">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Point of Sale
                  </h1>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg shadow-primary/20 px-3 py-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  Quick checkout for walk-in customers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-700">
                    System Online
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drugs by name, category, or generic..."
              className="h-14 pl-12 pr-4 text-base bg-white border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-all font-medium"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border-b border-slate-200/60 px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap border-2',
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-lg shadow-primary/25 scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:bg-slate-50',
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 pb-24">
            {filteredProducts.map((product, i) => (
              <button
                key={i}
                onClick={() => addToCart(product)}
                className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-primary hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden active:scale-95"
              >
                {/* Popular Badge */}
                {product.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      HOT
                    </div>
                  </div>
                )}

                {/* Gradient Background */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500',
                    product.color,
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    'h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300',
                    product.color,
                  )}
                >
                  <Pill className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider border-0">
                    {product.cat}
                  </Badge>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Package className="h-3 w-3" />
                      <span className="text-xs font-semibold">
                        {product.stock}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-bold text-slate-500">
                        GH₵
                      </span>
                      <span className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                        {product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                  <div className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 h-16 px-6 bg-gradient-to-r from-primary to-accent text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-3 font-black text-lg hover:scale-105 active:scale-95 transition-all z-50 border-2 border-white"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center animate-pulse">
              {itemCount}
            </div>
          )}
        </div>
        <span>View Cart</span>
        {total > 0 && (
          <>
            <div className="h-6 w-px bg-white/30" />
            <span>GH₵ {total.toFixed(2)}</span>
          </>
        )}
      </button>

      {/* Backdrop */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        />
      )}

      {/* Slide-in Cart Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Customer Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white">
                  Walk-in Customer
                </h3>
                <div className="flex items-center gap-2 text-white/60 text-xs font-bold mt-1">
                  <span>#ORD-{Math.floor(Math.random() * 10000)}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Cart is Empty
              </h3>
              <p className="text-sm text-slate-500 max-w-[250px] mb-6">
                Select products from the catalog to begin a new transaction
              </p>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="outline"
                className="rounded-xl"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all relative"
                >
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl font-black text-primary flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm mb-1 truncate pr-8">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold">
                          GH₵ {item.price.toFixed(2)} each
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          GH₵ {(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200">
                          <button
                            onClick={() => updateQty(item.name, -1)}
                            className="h-9 w-9 flex items-center justify-center hover:bg-white text-slate-600 hover:text-primary transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-black text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.name, 1)}
                            className="h-9 w-9 flex items-center justify-center hover:bg-white text-slate-600 hover:text-primary transition-all"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        <div className="bg-white border-t-2 border-slate-200 p-6 space-y-6">
          {/* Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 font-semibold">
                Subtotal ({itemCount} items)
              </span>
              <span className="font-bold text-slate-900">
                GH₵ {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-slate-200">
              <span className="text-lg font-bold text-slate-700">
                Total Amount
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-500">GH₵</span>
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-14 border-2 border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary font-bold rounded-xl transition-all group"
            >
              <CreditCard className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Card
            </Button>
            <Button
              variant="outline"
              className="h-14 border-2 border-slate-200 hover:border-accent hover:bg-accent/5 hover:text-accent font-bold rounded-xl transition-all group"
            >
              <Banknote className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Cash
            </Button>
          </div>

          {/* Process Button */}
          <Button
            disabled={cart.length === 0}
            className="w-full h-16 text-lg font-black bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl shadow-primary/30 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:from-slate-300 disabled:to-slate-400"
          >
            <TrendingUp className="h-6 w-6 mr-3" />
            Complete Transaction
          </Button>
        </div>
      </aside>
    </div>
  )
}
