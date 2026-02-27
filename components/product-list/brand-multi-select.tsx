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

interface BrandMultiSelectProps {
  brands: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function BrandMultiSelect({
  brands,
  value,
  onChange,
}: BrandMultiSelectProps) {
  const isMobile = useIsMobile();

  const toggleBrand = (brand: string) => {
    if (value.includes(brand)) {
      onChange(value.filter((b) => b !== brand));
    } else {
      onChange([...value, brand]);
    }
  };

  const label = value.length > 0 ? `${value.length} selected` : "Select brands";

  const ListContent = () => (
    <Command>
      <CommandEmpty>No brand found.</CommandEmpty>
      <CommandGroup>
        {brands.map((b) => (
          <CommandItem
            key={b}
            onSelect={() => toggleBrand(b)}
            className="flex items-center gap-2"
          >
            <Checkbox checked={value.includes(b)} />
            {b}
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
            <DrawerTitle>Select Brands</DrawerTitle>
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
          className="w-45 justify-between bg-transparent"
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
