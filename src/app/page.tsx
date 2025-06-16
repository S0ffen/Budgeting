"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center bg-blue-50 p-8">
      <h1 className="text-4xl font-bold mb-4">Witaj w BudgetApp 👋</h1>
      <p className="text-lg max-w-xl mb-6">
        To jest przykładowa aplikacja do zarządzania transakcjami. Zobacz demo
        działania klikając poniżej.
      </p>
      <Link
        href="/demo"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Zobacz Demo
      </Link>
    </main>
  );
}
