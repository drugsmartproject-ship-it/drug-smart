import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package } from 'lucide-react'

export function AddDrugDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Package className="mr-2 h-4 w-4" /> Add Drug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Drug</DialogTitle>
          <DialogDescription>
            Enter the details of the new drug to add to inventory. Click save
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Drug Name</Label>
            <Input id="name" placeholder="e.g. Paracetamol 500mg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analgesics">Analgesics</SelectItem>
                  <SelectItem value="antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="vitamins">Vitamins</SelectItem>
                  <SelectItem value="cardio">Cardiovascular</SelectItem>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="topicals">Topicals</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cost-price">Cost Price (GH₵)</Label>
              <Input id="cost-price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selling-price">Selling Price (GH₵)</Label>
              <Input id="selling-price" type="number" placeholder="0.00" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input id="expiry" type="date" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
