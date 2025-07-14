import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Link } from "react-router-dom"

export function BlogPostCard({ title, description, author, createdAt }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-1">
        <CardTitle className="text-xl font-bold line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {description ?? "This is the description"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto grid gap-2">
        <div className="text-muted-foreground text-sm">
          <span>By {author}</span> &bull;{" "}
          <span>{format(new Date(createdAt), "dd MMMM yyyy")}</span>
        </div>
        <Link to={""}>
          <Button className="w-full">Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
