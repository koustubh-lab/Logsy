import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BlogPostCardPlaceholder() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardFooter className="mt-auto grid gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full rounded" />
      </CardFooter>
    </Card>
  )
}
