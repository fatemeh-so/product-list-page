"use client";

import { Input } from "../ui/input";
import { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useBrands, useCategories } from "@/services/use-product";
import { CategoryMultiSelect } from "./CategoriesMultiSelect";
import { BrandMultiSelect } from "./brand-multi-select";
import { Slider } from "../ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerHeader,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductsFilter } from "@/context/products-filter-context";
import { ChevronDown, Search } from "lucide-react";

//Price Filter

interface PriceFilterContentProps {
  tempRange: [number, number];
  setTempRange: (range: [number, number]) => void;
  onApply: () => void;
  onClear: () => void;
}

function PriceFilterContent({
  tempRange,
  setTempRange,
  onApply,
  onClear,
}: PriceFilterContentProps) {
  return (
    <div className="flex flex-col gap-4 p-2">
      {/* step is intentionally omitted (defaults to 1) for smooth dragging */}
      <Slider
        value={tempRange}
        onValueChange={(value) => setTempRange(value as [number, number])}
        max={36999.99}
        min={0.79}
        className="mx-auto w-full max-w-xs"
      />
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={tempRange[0]}
          onChange={(e) => setTempRange([Number(e.target.value), tempRange[1]])}
          className="h-9"
        />
        <Input
          type="number"
          placeholder="Max"
          value={tempRange[1]}
          onChange={(e) => setTempRange([tempRange[0], Number(e.target.value)])}
          className="h-9"
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-9"
          onClick={onClear}
        >
          Clear
        </Button>
        <Button size="sm" className="flex-1 h-9" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

// ─── Sort Drawer Content ──────────────────────────────────────────────────────

const sortOptions = [
  { value: "desc", label: "Newest" },
  { value: "discount", label: "Biggest Discount" },
  { value: "LowPrice", label: "Price: Low to High" },
  { value: "HighPrice", label: "Price: High to Low" },
];

interface SortDrawerContentProps {
  currentSort: string | null;
  onSelect: (value: string) => void;
}

function SortDrawerContent({ currentSort, onSelect }: SortDrawerContentProps) {
  return (
    <div className="flex flex-col gap-2 p-4 pb-8">
      {sortOptions.map((opt) => (
        <Button
          key={opt.value}
          variant={currentSort === opt.value ? "default" : "outline"}
          className="w-full justify-start h-11 text-sm"
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

interface ProductListHeaderProps {
  total: number;
  productBrands?: string[];
  minPrice: number;
  maxPrice: number;
}

export default function ProductListHeader({
  total,
  minPrice,
  maxPrice,
}: ProductListHeaderProps) {
  const {
    setSearchTerm,
    searchTerm,
    setSortBy,
    setSelectedCategories,
    selectedCategories,
    selectedBrands,
    setSelectedBrands,
    setRange,
    range,
    inStock,
    setInStock,
    setPage,
  } = useProductsFilter();

  const isMobile = useIsMobile();
  const { data: categories } = useCategories();
  const categoriesOptions = categories?.map((n: any) => n.slug);
  const { data: brands } = useBrands();

  const [debouncedValue, setDebouncedValue] = useState(searchTerm);
  const [tempRange, setTempRange] = useState<[number, number]>(
    range ?? [minPrice, maxPrice],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(debouncedValue);
    }, 2500);
    return () => clearTimeout(timer);
  }, [debouncedValue, setSearchTerm]);

  const searchWithDebounce = (value: string) => {
    setPage(1);
    setDebouncedValue(value);
  };

  // Stable callbacks so PriceFilterContent doesn't re-mount
  const handleApply = useCallback(() => {
    setPage(1);
    setRange([tempRange[0], tempRange[1]]);
  }, [tempRange, setPage, setRange]);

  const handleClear = useCallback(() => {
    setPage(1);
    setRange([0.79, 36999.99]);
    setTempRange([0.79, 36999.99]);
  }, [setPage, setRange]);

  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<string | null>(null);

  const handleSortSelect = useCallback(
    (value: string) => {
      setCurrentSort(value);
      setPage(1);
      setSortBy(value);
      setSortDrawerOpen(false);
    },
    [setPage, setSortBy],
  );

  return (
    <div className="px-4 py-6">
      {/* row 1 - product count + search */}
      <div className="flex gap-4 justify-between items-center">
        <p className="text-lg font-semibold">{total} products</p>
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products"
            value={debouncedValue}
            onChange={(e) => searchWithDebounce(e.target.value)}
            className="pl-10 h-12 bg-white border-none shadow-none"
          />
        </div>
      </div>

      {/* row 2 - filters + in stock */}
      <div className="flex gap-4 justify-between items-center mt-6 flex-wrap">
        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto sm:flex sm:items-center sm:flex-wrap">
          {/* Sort */}
          {isMobile ? (
            <Drawer open={sortDrawerOpen} onOpenChange={setSortDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-9 justify-start font-normal bg-transparent"
                >
                  {currentSort
                    ? sortOptions.find((o) => o.value === currentSort)?.label
                    : "Sort by"}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Sort By</DrawerTitle>
                </DrawerHeader>
                <SortDrawerContent
                  currentSort={currentSort}
                  onSelect={handleSortSelect}
                />
              </DrawerContent>
            </Drawer>
          ) : (
            <Select
              onValueChange={(value) => {
                setPage(1);
                setSortBy(value);
              }}
            >
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {/* Categories */}
          <div className="w-full sm:w-auto">
            <CategoryMultiSelect
              categories={categoriesOptions ?? []}
              value={selectedCategories}
              onChange={(value) => {
                setPage(1);
                setSelectedCategories(value);
              }}
            />
          </div>

          {/* Brands */}
          <div className="w-full sm:w-auto">
            <BrandMultiSelect
              brands={brands ?? []}
              value={selectedBrands}
              onChange={(value) => {
                setPage(1);
                setSelectedBrands(value);
              }}
            />
          </div>

          {/* Price */}
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-9 justify-between font-normal bg-transparent"
                >
                  Price
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Select Price Range</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-8">
                  <PriceFilterContent
                    tempRange={tempRange}
                    setTempRange={setTempRange}
                    onApply={handleApply}
                    onClear={handleClear}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 h-9 justify-between font-normal bg-transparent"
                >
                  Price
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <PriceFilterContent
                  tempRange={tempRange}
                  setTempRange={setTempRange}
                  onApply={handleApply}
                  onClear={handleClear}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Right side - In Stock switch */}
        <div className="flex items-center gap-2">
          <Label htmlFor="in-stock" className="cursor-pointer text-sm">
            In Stock
          </Label>
          <Switch
            id="in-stock"
            checked={inStock}
            onCheckedChange={(checked) => setInStock(checked)}
            className="w-16 h-10"
          />
        </div>
      </div>
    </div>
  );
}
