import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { algorithms } from "@/lib/algorithms";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
  
  export function AlgorithmComparison() {
    return (
      <div className="w-full overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Algorithm</TableHead>
              <TableHead className="font-semibold text-center hidden sm:table-cell">Avg. Time</TableHead>
              <TableHead className="font-semibold text-center hidden sm:table-cell">Best Time</TableHead>
              <TableHead className="font-semibold text-center hidden sm:table-cell">Worst Time</TableHead>
              <TableHead className="font-semibold text-center hidden sm:table-cell">Space</TableHead>
              <TableHead className="font-semibold text-center">Stable</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {algorithms.map((algo) => (
                <TableRow key={algo.id} className="group cursor-pointer hover:bg-primary/5">
                    <TableCell className="font-medium">
                        <Link href={`/${algo.id}`} className="block">
                            {algo.name}
                            <p className="text-sm text-muted-foreground font-normal hidden lg:block">{algo.overview}</p>
                        </Link>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant="outline" className="font-code text-sm">{algo.complexity.average}</Badge>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant="outline" className="font-code text-sm">{algo.complexity.best}</Badge>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant="outline" className="font-code text-sm">{algo.complexity.worst}</Badge>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant="outline" className="font-code text-sm">{algo.complexity.space}</Badge>
                    </TableCell>
                    <TableCell className="flex justify-center">
                        <Link href={`/${algo.id}`} className="block h-full w-full">
                            {algo.stable ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-destructive mx-auto" />}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link href={`/${algo.id}`} className="flex items-center justify-end">
                            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </Link>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  