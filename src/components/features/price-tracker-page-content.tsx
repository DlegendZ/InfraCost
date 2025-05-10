"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Search, Loader2, Info } from "lucide-react";
import { suggestLocalPrices, type LocalPriceSuggestionsInput, type LocalPriceSuggestionsOutput } from '@/ai/flows/local-price-suggestions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


export function PriceTrackerPageContent() {
  const [material, setMaterial] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<LocalPriceSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !location.trim()) {
      toast({ title: "Missing fields", description: "Please enter both material and location.", variant: "destructive"});
      return;
    }

    setIsLoading(true);
    setPriceSuggestion(null);
    setError(null);

    try {
      const input: LocalPriceSuggestionsInput = { material, location };
      const result = await suggestLocalPrices(input);
      setPriceSuggestion(result);
    } catch (err) {
      console.error("Price suggestion error:", err);
      setError("Failed to fetch price suggestion. Please try again.");
      toast({ title: "Error", description: "Failed to fetch price suggestion.", variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <DollarSign className="text-primary h-7 w-7" /> Local Price Tracker
          </CardTitle>
          <CardDescription>
            Get AI-powered material price suggestions for your area based on current market trends.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="material">Material Name</Label>
              <Input
                id="material"
                type="text"
                placeholder="e.g., Cement, Steel Rebar"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="location">Project Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., New York City, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !material.trim() || !location.trim()} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Get Price Suggestion
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {priceSuggestion && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-xl">Price Suggestion Result</CardTitle>
            <CardDescription>For <span className="font-semibold text-primary">{material}</span> in <span className="font-semibold text-primary">{location}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Suggested Price:</span>
              <span className="text-2xl font-bold text-accent">{priceSuggestion.suggestedPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Unit:</span>
              <span className="font-medium">{priceSuggestion.unit}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Source / Market Trend:</span>
              <p className="text-sm border p-3 rounded-md bg-muted/50">{priceSuggestion.source}</p>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              Note: This is an AI-generated suggestion based on available data and may not reflect exact local prices. Always verify with local suppliers.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
