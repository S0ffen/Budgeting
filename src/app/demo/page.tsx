"use client";
import { useState } from "react";
import UserSidebarDemo from "./components/UserSidebarDemo";
import MainContentDemo from "./components/MainContentDemo";

export default function Demo() {
  const [selectedList, setSelectedList] = useState("Friends");

  return (
    <main className="flex min-h-screen">
      <UserSidebarDemo
        selectedList={selectedList}
        onSelectList={setSelectedList}
      />
      <MainContentDemo list={selectedList} />
    </main>
  );
}
