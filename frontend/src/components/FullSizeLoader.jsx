import BarsLoader from "./BarLoader"

export default function FullSizeLoader() {
  return (
    <div className="absolute top-0 left-0 w-screen z-[100] h-screen flex items-center justify-center bg-background/50 backdrop-blur-md pointer-events-none">
      <BarsLoader />
    </div>
  )
}
