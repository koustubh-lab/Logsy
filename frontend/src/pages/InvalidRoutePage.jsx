export default function InvalidRoutePage() {
  return (
    <div className="grid place-content-center h-screen">
      <div className="grid gap-3 justify-items-center p-44 border border-muted-foreground rounded-3xl">
        <h1 className="font-bold text-4xl md:text-6xl">Invalid Route</h1>
        <p className="text-muted-foreground">This route does not exist, please confirm the correct route.</p>
      </div>
    </div>
  )
}
