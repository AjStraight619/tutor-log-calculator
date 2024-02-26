import { ExcelTutoringSessionData, TransformedData } from "@/lib/types";
import { useEffect, useState } from "react";

export const useTransformedData = (
  tutoringData: ExcelTutoringSessionData[],
  chartType: "Pie Chart" | "Bar Chart"
) => {
  const [transformedData, setTransformedData] = useState<TransformedData[]>([]);

  useEffect(() => {
    let processedData: ExcelTutoringSessionData[] = [];
    if (!tutoringData.length) return;

    const filteredData = tutoringData.filter(
      (session) => session.subject?.toLowerCase() !== "subject"
    );

    if (chartType === "Pie Chart") {
      processedData = filteredData.map((session) => ({
        ...session,
        subject: session.subject?.toLowerCase(),
        topicsCovered: session.topicsCovered?.toLowerCase(),
      }));
    } else {
      processedData = filteredData.map((session) => ({
        ...session,
        subject: session.subject?.toLowerCase(),
        dates: session.date
          ? new Date(session.date).toLocaleDateString()
          : undefined,
      }));
    }

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
  }, [tutoringData, chartType]);

  return transformedData;
};
