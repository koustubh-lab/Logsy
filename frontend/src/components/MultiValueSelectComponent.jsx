import { Check, ChevronDown, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function MultiSelectCombobox({
  options,
  placeholder,
  selectedValues,
  setSelectedValues,
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const isAlreadySelected = selectedValues.includes(input)
  const isNewOption = input && !isAlreadySelected

  // Move selected options to the top, preserve custom options
  const customSelectedOptions = selectedValues
    .filter((val) => !options.find((opt) => opt.value === val))
    .map((val) => ({ value: val, label: val }))

  const builtInSelectedOptions = options
    .filter((opt) => selectedValues.includes(opt.value))
    .sort(
      (a, b) =>
        selectedValues.indexOf(a.value) - selectedValues.indexOf(b.value)
    )

  const unselectedOptions = options.filter(
    (opt) => !selectedValues.includes(opt.value)
  )

  const mergedOptions = [
    ...customSelectedOptions,
    ...builtInSelectedOptions,
    ...unselectedOptions,
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full max-w-full truncate overflow-hidden justify-between text-left",
            selectedValues.length < 1 && "text-muted-foreground"
          )}
        >
          <div className="truncate flex-1 text-left text-wrap py-2 max-w-full">
            {selectedValues.length > 0
              ? selectedValues
                  .map(
                    (val) => options.find((o) => o.value === val)?.label || val
                  )
                  .join(", ")
              : placeholder ?? "Select options"}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        forceMount
        className="w-[280px] p-0 overflow-y-auto"
        align="end"
      >
        <Command>
          <CommandInput
            value={input}
            onValueChange={setInput}
            placeholder="Search or add..."
          />
          <CommandList className="max-h-60 overflow-y-auto scroll-py-2">
            {mergedOptions.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  toggleValue(option.value)
                  setInput("")
                }}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-black dark:border-white",
                    selectedValues.includes(option.value)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50"
                  )}
                >
                  {selectedValues.includes(option.value) && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                {option.label}
              </CommandItem>
            ))}

            {isNewOption && (
              <CommandItem
                onSelect={() => {
                  toggleValue(input)
                  setInput("")
                }}
                className="cursor-pointer text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add "{input}"
              </CommandItem>
            )}

            {!mergedOptions.length && !isNewOption && (
              <CommandEmpty>No options found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
