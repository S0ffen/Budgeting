// src/app/components/InputBar.tsx
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <div className="h-14 w-full bg-blue-400  border-b border-black p-4">
      <p className="font-semibold">LIST NAME</p>
      <div>
        <Button>Click me</Button>
      </div>
    </div>
  );
}
