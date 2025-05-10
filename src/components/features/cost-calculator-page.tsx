"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, DollarSign, Loader2 } from "lucide-react";
import { suggestLocalPrices, type LocalPriceSuggestionsInput } from '@/ai/flows/local-price-suggestions';
import { useToast } from "@/hooks/use-toast";

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
  isAiPriceLoading: boolean;
}

const initialUnits = ["sq ft", "cubic meter", "kg", "ton", "item", "length (m)", "length (ft)"];

export function CostCalculatorPage() {
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState<number | string>("");
  const [newItemUnit, setNewItemUnit] = useState(initialUnits[0]);
  const [newItemPrice, setNewItemPrice] = useState<number | string>("");
  const [totalCost, setTotalCost] = useState(0);
  const [userLocation, setUserLocation] = useState<string>(""); // For AI price suggestions

  const { toast } = useToast();

  useEffect(() => {
    const newTotalCost = items.reduce((sum, item) => sum + item.total, 0);
    setTotalCost(newTotalCost);
  }, [items]);
  
  // Effect to generate unique IDs safely on client
  const [nextId, setNextId] = useState(0);
  useEffect(() => {
    setNextId(Date.now()); // Initialize with a timestamp-based value
  }, []);


  const handleAddItem = () => {
    if (!newItemName || !newItemQuantity || !newItemUnit || !newItemPrice) {
      toast({ title: "Missing fields", description: "Please fill in all item details.", variant: "destructive" });
      return;
    }
    const quantity = Number(newItemQuantity);
    const price = Number(newItemPrice);

    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
      toast({ title: "Invalid input", description: "Quantity and Price must be valid numbers.", variant: "destructive" });
      return;
    }
    
    const currentId = nextId;
    setNextId(prev => prev + 1);


    const newItem: MaterialItem = {
      id: `item-${currentId}-${Math.random().toString(36).substr(2, 9)}`,
      name: newItemName,
      quantity: quantity,
      unit: newItemUnit,
      pricePerUnit: price,
      total: quantity * price,
      isAiPriceLoading: false,
    };
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemUnit(initialUnits[0]);
    setNewItemPrice("");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof MaterialItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'pricePerUnit') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const pricePerUnit = field === 'pricePerUnit' ? Number(value) : item.pricePerUnit;
          if (!isNaN(quantity) && !isNaN(pricePerUnit)) {
            updatedItem.total = quantity * pricePerUnit;
          }
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const fetchAiPrice = async (itemId: string, materialName: string) => {
    if (!userLocation.trim()) {
      toast({ title: "Location needed", description: "Please enter your project location to get AI price suggestions.", variant: "destructive" });
      return;
    }
    if (!materialName.trim()) {
      toast({ title: "Material name needed", description: "Please enter a material name for AI price suggestion.", variant: "destructive" });
      return;
    }

    setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, isAiPriceLoading: true } : item));

    try {
      const input: LocalPriceSuggestionsInput = { material: materialName, location: userLocation };
      const result = await suggestLocalPrices(input);
      
      const suggestedPrice = parseFloat(result.suggestedPrice.replace(/[^0-9.-]+/g,"")); // Extract number from string like "$10.50"
      if (!isNaN(suggestedPrice)) {
        handleUpdateItem(itemId, 'pricePerUnit', suggestedPrice);
         toast({ title: "AI Price Updated", description: `Suggested price for ${materialName} is ${result.suggestedPrice} per ${result.unit}. Source: ${result.source}` });
      } else {
        toast({ title: "AI Price Error", description: `Could not parse price from AI: ${result.suggestedPrice}`, variant: "destructive" });
      }
    } catch (error) {
      console.error("AI Price Suggestion Error:", error);
      toast({ title: "AI Error", description: "Failed to get price suggestion from AI.", variant: "destructive" });
    } finally {
      setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, isAiPriceLoading: false } : item));
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Cost Calculator</CardTitle>
          <CardDescription>Estimate your building infrastructure costs. Add materials and quantities below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userLocation">Project Location (for AI Price Suggestions)</Label>
              <Input 
                id="userLocation" 
                placeholder="e.g., San Francisco, CA" 
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="itemName">Material Name</Label>
              <Input id="itemName" placeholder="e.g., Concrete" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="itemQuantity">Quantity</Label>
              <Input id="itemQuantity" type="number" placeholder="e.g., 10" value={newItemQuantity} onChange={(e) => setNewItemQuantity(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="itemUnit">Unit</Label>
              <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                <SelectTrigger id="itemUnit" className="mt-1">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {initialUnits.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="itemPrice">Price per Unit</Label>
              <Input id="itemPrice" type="number" placeholder="e.g., 50" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="mt-1" />
            </div>
          </div>
          <Button onClick={handleAddItem} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Material List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input 
                        value={item.name} 
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                        className="w-full min-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                       <Select value={item.unit} onValueChange={(value) => handleUpdateItem(item.id, 'unit', value)}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {initialUnits.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Input 
                        type="number" 
                        value={item.pricePerUnit} 
                        onChange={(e) => handleUpdateItem(item.id, 'pricePerUnit', Number(e.target.value))}
                        className="w-28"
                      />
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fetchAiPrice(item.id, item.name)}
                        disabled={item.isAiPriceLoading}
                        title="Get AI Price Suggestion"
                        className="text-primary hover:text-primary/80"
                      >
                        {item.isAiPriceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="text-xl font-bold">
              Total Estimated Cost: <span className="text-primary">${totalCost.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
