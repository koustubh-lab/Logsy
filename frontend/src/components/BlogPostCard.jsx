import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"

export function BlogPostCard({
  title,
  description,
  author,
  date,
  imageUrl,
  slug,
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <span>By {author}</span> &bull; <span>{date}</span>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link href={`/blog/${slug}`} passHref>
          <Button variant="outline" className="w-full bg-transparent">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
