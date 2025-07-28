import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { Transaction } from "./MainContentDemo"; // Adjust the import path as necessary

import { format, set } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import { type ChartConfig } from "@/components/ui/chart";

type Props = {
  selectedList: string;
};

const ExpensesPanel: React.FC<Props> = ({ selectedList }) => {
  type BarCategoryData = {
    category: string;
    value: number;
  };

  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();
  const [chartData, setChartData] = useState<BarCategoryData[]>([]);
  const [sumValue, setSumValue] = useState<number>(0);

  useEffect(() => {
    if (!fromDate || !toDate) return;
    // zresetowanie wartości sumy przy zmianie dat
    setSumValue(0);

    const raw = localStorage.getItem("demo_lists");
    const parsed = JSON.parse(raw || "{}");
    const currentListTransactions = parsed[selectedList].transactions || [];

    const fromDateTimestamp = fromDate.getTime();
    const toDateTimestamp = toDate.getTime();

    console.log("before filter", currentListTransactions);

    const filteredTransactions = currentListTransactions.filter(
      (e: Transaction) => {
        const transactionDate = new Date(e.date).getTime();
        return (
          transactionDate <= toDateTimestamp &&
          transactionDate >= fromDateTimestamp
        );
      }
    );

    const grouped: Record<string, number> = {};

    filteredTransactions.forEach((tx: Transaction) => {
      grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount;
      setSumValue((prev) => prev + tx.amount);
    });

    const result: BarCategoryData[] = Object.entries(grouped).map(
      ([category, value]) => ({ category, value })
    );

    setChartData(result);
    console.log("after filter", filteredTransactions);
    console.log("chart data", result);
  }, [toDate, fromDate]);

  const chartConfig = {
    food: {
      label: "food",
      color: "#60a5fa",
    },
    home: {
      label: "other",
      color: "#2563eb",
    },
    other: {
      label: "home",
      color: "#f97316",
    },
    subscription: {
      label: "subscription",
      color: "#10b981",
    },
  } satisfies ChartConfig;
  return (
    <div className="bg-zinc-100 h-3/4">
      <div className=" flex items-center justify-center gap-4 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!fromDate}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal mr-6"
            >
              <CalendarIcon />
              {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={setFromDate}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!toDate}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon />
              {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={toDate} onSelect={setToDate} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className="min-h-[300px] max-h-[600px] w-2/3 mt-6"
        >
          <BarChart data={chartData}>
            <XAxis
              dataKey="category"
              tick={{
                fontSize: 18,
                fontWeight: 500,
              }}
            />
            <YAxis />
            <Tooltip
              itemStyle={{
                color: "black",
                fontSize: "14px",
              }}
              contentStyle={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
            <CartesianGrid vertical={false} />

            <Bar dataKey="value" fill="#2563eb" radius={[16, 16, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 18, fontWeight: "bold", fill: "#000000" }} // text-gray-900
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <AnimatePresence>
        {sumValue > 0 && (
          <motion.div
            key="sum"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center mt-4"
          >
            <span className="text-2xl font-bold">SUM: {sumValue}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpensesPanel;
