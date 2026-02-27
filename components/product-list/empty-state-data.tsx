import { Button } from "../ui/button";
import { PackageSearch, RefreshCcw } from "lucide-react";

export function EmptyState() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-24 px-6 text-center gap-4">
      <div className="bg-gray-100 p-4 rounded-full">
        <PackageSearch className="w-8 h-8 text-gray-400" />
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
          Try adjusting your filters or search term to find what you're looking
          for.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.location.reload();
          }}
          className="gap-2 mt-1"
        >
          <RefreshCcw className="w-4 h-4" />
          ReLoad
        </Button>
      </div>
    </div>
  );
}
