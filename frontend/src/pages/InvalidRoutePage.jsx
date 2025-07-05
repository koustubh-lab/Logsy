export default function InvalidRoutePage() {
  return (
    <div className="grid place-items-center h-screen">
      <div className="grid gap-3 place-content-center justify-items-center p-4 w-full sm:w-2/3 h-2/3 shadow-lg rounded-3xl">
        <h1 className="font-bold text-4xl md:text-6xl">Invalid Route</h1>
        <p className="text-muted-foreground text-center">
          This route does not exist, please confirm the correct route.
        </p>
      </div>
    </div>
  )
}
