import { ExcelTutoringSessionData } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Text,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

type CustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  payload: any;
};

type TransformedData = {
  name: string;
  value: number;
};

const ChartPie = ({
  tutoringData,
  files,
}: {
  tutoringData: ExcelTutoringSessionData[];
  files: File[];
}) => {
  const [transformedData, setTransformedData] = useState<TransformedData[]>([]);

  useEffect(() => {
    const filteredData = tutoringData.filter(
      (session) => session.subject?.toLowerCase() !== "subject"
    );

    const processedData = filteredData.map((session) => ({
      ...session,
      subject: session.subject?.toLowerCase(),
      topicsCovered: session.topicsCovered?.toLowerCase(),
    }));

    const subjectCounts = processedData.reduce((acc, session) => {
      const { subject } = session;
      if (subject) {
        acc[subject] = (acc[subject] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(subjectCounts).map((key) => ({
      name: key,
      value: subjectCounts[key],
    }));

    setTransformedData(chartData);
  }, [tutoringData, files]);

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={400} height={400}>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {transformedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend formatter={(value: number) => <span>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>

      {/* <pre>{JSON.stringify(transformedData, null, 2)}</pre> */}
    </>
  );
};

export default ChartPie;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <Text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </Text>
  );
};
