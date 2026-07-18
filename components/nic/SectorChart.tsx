"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useI18n } from "@/lib/i18n";
import { SectorData, Language } from "@/lib/types";

// Chart palette using CSS variable references as hex fallbacks
const CHART_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-info)",
  "#7c3aed", // purple
  "#ea580c", // orange
];

// Resolved hex values for Recharts (CSS vars don't work inside SVG fill attrs)
const CHART_HEX = [
  "#073cad",
  "#e33500",
  "#16a34a",
  "#d97706",
  "#0ea5e9",
  "#7c3aed",
  "#ea580c",
];

interface SectorChartProps {
  data: SectorData[];
  lang: Language;
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: SectorData & { fill: string };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="card !p-3 !rounded-xl border border-border shadow-[var(--shadow-md)] min-w-[140px]">
      <p className="text-sm font-semibold text-foreground">{item.name}</p>
      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
        {item.value} startups
      </p>
    </div>
  );
}

function CustomLegend({
  payload,
}: {
  payload?: { value: string; color: string }[];
}) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-[var(--color-text-muted)] font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SectorChart({ data, lang }: SectorChartProps) {
  const { t } = useI18n();

  const chartData = data.map((d) => ({
    ...d,
    name: lang === "vi" ? d.sectorVi : d.sector,
  }));

  return (
    <div className="card flex flex-col h-full">
      <h3 className="text-base font-semibold text-foreground mb-4">
        {t("nic.chart.sector")}
      </h3>
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius="52%"
              outerRadius="75%"
              paddingAngle={3}
              dataKey="count"
              nameKey="name"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_HEX[index % CHART_HEX.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
