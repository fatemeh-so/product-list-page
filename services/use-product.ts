// get products form reactQueries

import {
  fetchBrands,
  fetchCategories,
  fetchProducts,
  getProduct,
  ProductResponse,
  ProductSubset,
} from "@/app/action";
import { useQuery } from "@tanstack/react-query";
interface UseProductParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  fields?: string;
  category?: string;
  brand?: string;
  range?: [number, number];
  inStock?: boolean;
}
export const useProduct = ({
  page = 1,
  limit = 16,
  searchQuery = "",
  sortBy = "",
  order = "asc",
  category = "",
  fields = "",
  brand = "",
  range = [0.79, 36999.99],
  inStock = false,
}: UseProductParams) =>
  useQuery({
    queryKey: [
      "products",
      page,
      limit,
      searchQuery,
      sortBy,
      order,
      fields,
      category,
      brand,
      range,
      inStock,
    ],
    queryFn: async () => {
      const data = await fetchProducts(
        page,
        limit,
        searchQuery,
        sortBy,
        order,
        fields,
        category,
        brand,
        range,
        inStock,
      );
      return data as ProductResponse;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await fetchCategories();
      return data as string[];
    },
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const data = await fetchBrands();
      return data as string[];
    },
  });
};

export const useProductById = (id: number | undefined) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const data = await getProduct(id);
      return data as ProductSubset;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
