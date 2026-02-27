import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProductsFilter } from "@/context/products-filter-context";
interface PaginationProps {
  total: number;
}
export function PaginationDemo({ total }: PaginationProps) {
  const { page, setPage } = useProductsFilter();
  const totalPages = Math.ceil(total / 16);
  const currentPage = page;
  const getVisiblePages = () => {
    const delta = 1; // how many pages around current
    const range: number[] = [];
    ``;

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    return range;
  };

  const visiblePages = getVisiblePages();
  return (
    <Pagination className="py-8">
      <PaginationContent>
        <PaginationPrevious
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
          isActive={page > 1}
        />

        {/* Always show first page */}
        <PaginationItem>
          <PaginationLink onClick={() => setPage(1)} isActive={page >= 1}>
            1
          </PaginationLink>
        </PaginationItem>

        {/* Left ellipsis */}
        {page > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Middle pages */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setPage(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Always show last page (if more than 1) */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => setPage(totalPages)}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationNext
          onClick={() => {
            if (page < totalPages) {
              setPage(page + 1);
            }
          }}
          isActive={page < totalPages}
        />
      </PaginationContent>
    </Pagination>
  );
}
