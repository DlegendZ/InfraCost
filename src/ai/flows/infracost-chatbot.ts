// src/ai/flows/infracost-chatbot.ts
'use server';
/**
 * @fileOverview An AI chatbot for answering questions about building materials and processes.
 *
 * - infracostChatbot - A function that handles the chatbot interactions.
 * - InfracostChatbotInput - The input type for the infracostChatbot function.
 * - InfracostChatbotOutput - The return type for the infracostChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InfracostChatbotInputSchema = z.object({
  question: z.string().describe('The question to ask the chatbot.'),
});
export type InfracostChatbotInput = z.infer<typeof InfracostChatbotInputSchema>;

const InfracostChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer from the chatbot.'),
});
export type InfracostChatbotOutput = z.infer<typeof InfracostChatbotOutputSchema>;

export async function infracostChatbot(input: InfracostChatbotInput): Promise<InfracostChatbotOutput> {
  return infracostChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'infracostChatbotPrompt',
  input: {schema: InfracostChatbotInputSchema},
  output: {schema: InfracostChatbotOutputSchema},
  prompt: `You are a chatbot that answers questions about building materials and processes.

  Question: {{{question}}}
  Answer:`,
});

const infracostChatbotFlow = ai.defineFlow(
  {
    name: 'infracostChatbotFlow',
    inputSchema: InfracostChatbotInputSchema,
    outputSchema: InfracostChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
