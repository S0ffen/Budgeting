"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SupportForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    // Tu możesz później dodać API do wysyłki e-maila
    console.log("Sending message:", message);

    setSent(true);
    setMessage("");
    setError("");
  };

  if (sent) {
    return (
      <p className="text-green-600 text-sm font-medium">
        Your message was sent. Thank you!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        placeholder="Describe your issue or feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        onClick={handleSend}
        className="w-full bg-teal-600 hover:bg-teal-700"
      >
        Send
      </Button>
    </div>
  );
}
