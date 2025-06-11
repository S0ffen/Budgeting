"use client";

import { useState } from "react";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar onSelectUser={setSelectedUser} />
      <div className="flex flex-col flex-1">
        <TopBar />
        <MainContent selectedUser={selectedUser} />
      </div>
    </div>
  );
}
