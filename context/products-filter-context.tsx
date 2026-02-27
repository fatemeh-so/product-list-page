"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FiltersState {
  searchTerm: string;
  page: number;
  sortBy: string;
  order: "asc" | "desc";
  range: [number, number] | undefined;
  selectedBrands: string[];
  selectedCategories: string[];
  inStock: boolean;
}

interface FiltersContextType extends FiltersState {
  setSearchTerm: (value: string) => void;
  setPage: (value: number) => void;
  setSortBy: (value: string) => void;
  setOrder: (value: "asc" | "desc") => void;
  setRange: (value: [number, number]) => void;
  setSelectedBrands: (value: string[]) => void;
  setSelectedCategories: (value: string[]) => void;
  setInStock: (value: boolean) => void;
}

const ProductsFilterContext = createContext<FiltersContextType | null>(null);

export const ProductsFilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [range, setRange] = useState<[number, number]>();
  return (
    <ProductsFilterContext.Provider
      value={{
        searchTerm,
        page,
        sortBy,
        order,
        range,
        selectedBrands,
        selectedCategories,
        inStock,
        setSearchTerm,
        setPage,
        setSortBy,
        setOrder,
        setRange,
        setSelectedBrands,
        setSelectedCategories,
        setInStock,
      }}
    >
      {children}
    </ProductsFilterContext.Provider>
  );
};

export const useProductsFilter = () => {
  const context = useContext(ProductsFilterContext);
  if (!context) {
    throw new Error(
      "useProductsFilter must be used inside ProductsFilterProvider",
    );
  }
  return context;
};
