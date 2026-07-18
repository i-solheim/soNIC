"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Legend,
} from "recharts";
import { useI18n } from "@/lib/i18n";
import { FundingDemandData, RecommendationTrend, Language } from "@/lib/types";

interface FundingChartProps {
  data: FundingDemandData[] | RecommendationTrend[];
  type: "funding" | "trend";
  lang: Language;
}

function formatUSD(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function FundingTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !p-3 !rounded-xl border border-border shadow-[var(--shadow-md)]">
      <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-[var(--color-text-muted)]">
          {p.name === "totalUSD" ? formatUSD(p.value) : `${p.value}`}
        </p>
      ))}
    </div>
  );
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card !p-3 !rounded-xl border border-border shadow-[var(--shadow-md)]">
      <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function FundingChart({ data, type, lang }: FundingChartProps) {
  const { t } = useI18n();

  if (type === "funding") {
    const fundingData = data as FundingDemandData[];
    const chartData = fundingData.map((d) => ({
      ...d,
      stageName: lang === "vi" ? d.stageVi : d.stage,
    }));

    return (
      <div className="card flex flex-col h-full">
        <h3 className="text-base font-semibold text-foreground mb-4">
          {t("nic.chart.funding")}
        </h3>
        <div className="flex-1 min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="stageName"
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatUSD}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<FundingTooltip />} />
              <Bar
                dataKey="totalUSD"
                fill="#073cad"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // trend type
  const trendData = data as RecommendationTrend[];

  return (
    <div className="card flex flex-col h-full">
      <h3 className="text-base font-semibold text-foreground mb-4">
        {t("nic.chart.recommendations")}
      </h3>
      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip content={<TrendTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
              }}
            />
            <Line
              type="monotone"
              dataKey="recommendations"
              stroke="#073cad"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#073cad", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="accepted"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
