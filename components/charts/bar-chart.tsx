import { TransformedData } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartBarProps = {
  transformedData: TransformedData[];
};

const ChartBar = ({ transformedData }: ChartBarProps) => {
  const dataForBarChart = transformedData.map((item, index) => ({
    name: item.name,
    sessions: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={transformedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend align="center" verticalAlign="top" /> */}
        <Bar dataKey="value" fill="#8884d8" name="Sessions Count" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBar;
