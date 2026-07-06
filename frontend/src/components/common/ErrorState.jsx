import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-sm text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}