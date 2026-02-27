"use client";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryMultiSelectProps {
  categories: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function CategoryMultiSelect({
  categories,
  value,
  onChange,
}: CategoryMultiSelectProps) {
  const isMobile = useIsMobile();

  const toggleCategory = (category: string) => {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category));
    } else {
      onChange([...value, category]);
    }
  };

  const label =
    value.length > 0 ? `${value.length} selected` : "Select categories";

  const ListContent = () => (
    <Command>
      <CommandEmpty>No category found.</CommandEmpty>
      <CommandGroup>
        {categories.map((category) => (
          <CommandItem
            key={category}
            onSelect={() => toggleCategory(category)}
            className="flex items-center gap-2"
          >
            <Checkbox checked={value.includes(category)} />
            {category}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-transparent"
          >
            {label}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select Categories</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-8 overflow-y-auto max-h-[60vh]">
            <ListContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-45 justify-between bg-transparent "
        >
          {label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 max-h-[200px] overflow-y-auto">
        <ListContent />
      </PopoverContent>
    </Popover>
  );
}
