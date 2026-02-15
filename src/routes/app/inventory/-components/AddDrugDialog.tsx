import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'

interface AddDrugDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function AddDrugDialog({ isOpen, setIsOpen }: AddDrugDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg shadow-primary/20 rounded-xl border-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Drug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Add New Drug
          </DialogTitle>
          <DialogDescription>
            Enter the details of the new drug to add to inventory
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-bold">
              Drug Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Paracetamol 500mg"
              className="rounded-xl h-11"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category" className="font-bold">
                Category
              </Label>
              <Select>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analgesics">Analgesics</SelectItem>
                  <SelectItem value="antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="vitamins">Vitamins</SelectItem>
                  <SelectItem value="respiratory">Respiratory</SelectItem>
                  <SelectItem value="digestive">Digestive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier" className="font-bold">
                Supplier
              </Label>
              <Input
                id="supplier"
                placeholder="Supplier name"
                className="rounded-xl h-11"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cost" className="font-bold">
                Cost Price (GH₵)
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="0.00"
                className="rounded-xl h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selling" className="font-bold">
                Selling Price (GH₵)
              </Label>
              <Input
                id="selling"
                type="number"
                placeholder="0.00"
                className="rounded-xl h-11"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="font-bold">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                className="rounded-xl h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry" className="font-bold">
                Expiry Date
              </Label>
              <Input id="expiry" type="date" className="rounded-xl h-11" />
            </div>
          </div>
        </div>
        <Separator />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-primary to-accent text-white rounded-xl"
          >
            Save Drug
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
