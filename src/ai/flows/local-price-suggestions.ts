// src/ai/flows/local-price-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting local material prices using AI.
 *
 * - suggestLocalPrices - A function that takes a material and location as input and returns suggested prices.
 * - LocalPriceSuggestionsInput - The input type for the suggestLocalPrices function.
 * - LocalPriceSuggestionsOutput - The return type for the suggestLocalPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocalPriceSuggestionsInputSchema = z.object({
  material: z.string().describe('The building material to get price suggestions for.'),
  location: z.string().describe('The location to get price suggestions for (e.g., city, state).'),
});
export type LocalPriceSuggestionsInput = z.infer<typeof LocalPriceSuggestionsInputSchema>;

const LocalPriceSuggestionsOutputSchema = z.object({
  suggestedPrice: z.string().describe('Suggested price for the material in the specified location based on current market trends.'),
  unit: z.string().describe('The unit of measurement for the suggested price (e.g., per cubic meter, per ton).'),
  source: z.string().describe('The data source or market trend that was used to provide the suggested price.'),
});
export type LocalPriceSuggestionsOutput = z.infer<typeof LocalPriceSuggestionsOutputSchema>;

export async function suggestLocalPrices(input: LocalPriceSuggestionsInput): Promise<LocalPriceSuggestionsOutput> {
  return localPriceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'localPriceSuggestionsPrompt',
  input: {schema: LocalPriceSuggestionsInputSchema},
  output: {schema: LocalPriceSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides price suggestions for building materials based on current market trends in a specific location.

  Material: {{{material}}}
  Location: {{{location}}}

  Provide a suggested price, unit of measurement, and the data source or market trend used to provide the price.`,
});

const localPriceSuggestionsFlow = ai.defineFlow(
  {
    name: 'localPriceSuggestionsFlow',
    inputSchema: LocalPriceSuggestionsInputSchema,
    outputSchema: LocalPriceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
