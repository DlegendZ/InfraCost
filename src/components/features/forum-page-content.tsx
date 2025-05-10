"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const forumTopics = [
  {
    id: "1",
    title: "Best practices for estimating concrete costs?",
    description: "Looking for advice on accurately estimating costs for a large concrete pour. What factors should I consider beyond material and labor?",
    author: "BuildMasterPro",
    avatar: "https://picsum.photos/seed/user1/40/40",
    date: "2 days ago",
    replies: 15,
    tags: ["concrete", "estimation", "best practices"],
    image: "https://picsum.photos/seed/topic1/600/300",
    dataAiHint: "construction concrete"
  },
  {
    id: "2",
    title: "Fluctuations in steel prices - how to budget?",
    description: "Steel prices seem to be all over the place. How are you all budgeting for steel in long-term projects?",
    author: "SteelHeart77",
    avatar: "https://picsum.photos/seed/user2/40/40",
    date: "5 days ago",
    replies: 8,
    tags: ["steel", "budgeting", "market trends"],
    image: "https://picsum.photos/seed/topic2/600/300",
    dataAiHint: "steel beams"
  },
  {
    id: "3",
    title: "Sustainable building materials - cost vs. benefit",
    description: "Exploring sustainable building materials for a new commercial project. What are the upfront cost differences and long-term benefits?",
    author: "EcoConstructor",
    avatar: "https://picsum.photos/seed/user3/40/40",
    date: "1 week ago",
    replies: 22,
    tags: ["sustainability", "green building", "materials"],
    image: "https://picsum.photos/seed/topic3/600/300",
    dataAiHint: "sustainable building"
  },
];

export function ForumPageContent() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Community Forum</CardTitle>
          <CardDescription>
            Discuss building costs, materials, and share insights with the community. 
            <span className="block mt-2 font-semibold text-accent">Note: This forum is currently a placeholder and under development.</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {forumTopics.map((topic) => (
          <Card key={topic.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
            {topic.image && (
               <div className="relative h-48 w-full">
                <Image 
                    src={topic.image} 
                    alt={topic.title} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-lg"
                    data-ai-hint={topic.dataAiHint}
                />
               </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{topic.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.avatar} alt={topic.author} data-ai-hint="person avatar"/>
                  <AvatarFallback>{topic.author.substring(0,1)}</AvatarFallback>
                </Avatar>
                <span>{topic.author}</span>
                <span>&bull;</span>
                <span>{topic.date}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4">
              <div className="flex gap-2 flex-wrap">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">{tag}</Badge>
                ))}
              </div>
              <span className="text-sm text-primary font-medium">{topic.replies} replies</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
