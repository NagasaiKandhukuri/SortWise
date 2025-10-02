import { AlgorithmComparison } from "@/components/sorting/algorithm-comparison";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl lg:text-6xl/none font-headline">
          Master Sorting Algorithms
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Dive into the world of sorting algorithms. SortWise provides detailed explanations,
          interactive visualizations, and complexity analysis to help you master how data is sorted.
          Whether you're a student, a developer, or just curious, this is your playground to understand
          the building blocks of computer science.
        </p>
      </header>

      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6 font-headline text-center">Algorithm at a Glance</h2>
        <AlgorithmComparison />
      </section>

      <footer className="text-center mt-12 text-muted-foreground text-sm">
        <p>Built for education and exploration. Happy sorting!</p>
      </footer>
    </div>
  );
}
