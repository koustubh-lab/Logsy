export default function ContactCard({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-md hover:bg-muted">
      <Icon className="h-6 w-6 text-primary" />
      <p className="text-muted-foreground flex-1">
        {text}
      </p>
    </div>
  )
}
