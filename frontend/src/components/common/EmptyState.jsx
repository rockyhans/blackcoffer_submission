import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No data found for these filters" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Inbox className="h-8 w-8 text-gray-300" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}