import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

// ── Error state ──────────────────────────────────────────────────────────────
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-24 px-6 text-center gap-4">
      <div className="bg-red-50 p-4 rounded-full">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-lg">
          Something went wrong
        </p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2 mt-1"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </Button>
    </div>
  );
}
