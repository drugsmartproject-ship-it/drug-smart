import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function NewSaleButton() {
  return (
    <Link to="/app/new-transaction">
      <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 border-0 rounded-xl px-6 h-11">
        <ShoppingCart className="mr-2 h-4 w-4" /> New Sale
      </Button>
    </Link>
  )
}
