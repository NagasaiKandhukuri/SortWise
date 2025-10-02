import { algorithms, getAlgorithmById } from "@/lib/algorithms";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortingVisualizer } from "@/components/sorting/sorting-visualizer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DryRunVisualizer } from "@/components/sorting/dry-run-visualizer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle } from "lucide-react";

export async function generateStaticParams() {
  return algorithms.map((algo) => ({
    slug: algo.id,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AlgorithmPage({ params }: Props) {
  const { slug } = await params;
  const algorithm = getAlgorithmById(slug);


  if (!algorithm) {
    notFound();
  }

  const complexities = [
    { label: "Best Case Time", value: algorithm.complexity.best },
    { label: "Average Case Time", value: algorithm.complexity.average },
    { label: "Worst Case Time", value: algorithm.complexity.worst },
    { label: "Space Complexity", value: algorithm.complexity.space },
  ];

  const codeLanguages = Object.keys(algorithm.code);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{algorithm.name}</h1>
        <div className="flex items-center gap-2">
            <p className="text-muted-foreground max-w-2xl">{algorithm.overview}</p>
            {algorithm.stable && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary">Stable</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">A sorting algorithm is stable if it preserves the relative order of equal elements.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>
      </header>

      <Tabs defaultValue="visualizer" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="visualizer">Visualize</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="dry-run">Dry Run</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="visualizer" className="mt-6">
          <SortingVisualizer algorithmId={algorithm.id} algorithmName={algorithm.name} />
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How it Works</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground/80">
                  <p>{algorithm.explanation.short}</p>
                </CardContent>
              </Card>
               <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">Dive Deeper into {algorithm.name}</AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Detailed Step-by-Step</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert max-w-none text-foreground/80">
                            {algorithm.explanation.long}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle  className="text-xl">Strengths & Weaknesses</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-base">Strengths</h4>
                                <ul className="space-y-2">
                                    {algorithm.explanation.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-foreground/80">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div className="space-y-3">
                                <h4 className="font-semibold text-base">Weaknesses</h4>
                                <ul className="space-y-2">
                                    {algorithm.explanation.weaknesses.map((w, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <XCircle className="h-4 w-4 mt-1 text-destructive flex-shrink-0" />
                                            <span className="text-sm text-foreground/80">{w}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle  className="text-xl">Detailed Complexity Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-base flex items-center gap-2">Best Case: <Badge variant="outline" className="font-code text-sm">{algorithm.complexity.best}</Badge></h4>
                                <p className="text-sm text-foreground/80 mt-1">{algorithm.explanation.detailedComplexity.best}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-base flex items-center gap-2">Average Case: <Badge variant="outline" className="font-code text-sm">{algorithm.complexity.average}</Badge></h4>
                                <p className="text-sm text-foreground/80 mt-1">{algorithm.explanation.detailedComplexity.average}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-base flex items-center gap-2">Worst Case: <Badge variant="outline" className="font-code text-sm">{algorithm.complexity.worst}</Badge></h4>
                                <p className="text-sm text-foreground/80 mt-1">{algorithm.explanation.detailedComplexity.worst}</p>
                            </div>
                        </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Complexity</CardTitle>
                  <CardDescription>Big O Notation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complexities.map((c) => (
                    <div key={c.label}>
                      <p className="text-sm font-medium">{c.label}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-base font-code">{c.value}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                    {algorithm.explanation.useCases}
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Pseudocode</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm font-code overflow-x-auto">
                    <code>{algorithm.explanation.pseudocode}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="dry-run" className="mt-6">
            <Card>
                <CardHeader>
                  <CardTitle>Dry Run</CardTitle>
                  <CardDescription>A step-by-step walkthrough of the algorithm with a sample array.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DryRunVisualizer algorithmId={algorithm.id} />
                </CardContent>
              </Card>
        </TabsContent>
        <TabsContent value="code" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Implementation</CardTitle>
                    <CardDescription>Example implementations in different languages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={codeLanguages[0]} className="w-full">
                        <TabsList>
                            {codeLanguages.map(lang => (
                                <TabsTrigger key={lang} value={lang} className="capitalize">{lang}</TabsTrigger>
                            ))}
                        </TabsList>
                        {codeLanguages.map(lang => (
                            <TabsContent key={lang} value={lang}>
                                <pre className="bg-muted p-4 rounded-lg text-sm font-code overflow-x-auto mt-4">
                                    <code>{algorithm.code[lang]}</code>
                                </pre>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
