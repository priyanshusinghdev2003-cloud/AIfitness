import { Loader2Icon } from "lucide-react";

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2Icon className="animate-spin h-8 w-8 text-green-500" />
    </div>
  );
}

export default Loading;
