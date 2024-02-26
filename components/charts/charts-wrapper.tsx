import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransformedData } from "@/hooks/useTransformedData";
import { ExcelTutoringSessionData, FileData } from "@/lib/types";
import { useState } from "react";
import ChartBar from "./bar-chart";
import ChartPie from "./pie-chart";

type ChartsWrapperProps = {
  tutoringData: ExcelTutoringSessionData[];
  files: FileData[];
};

const ChartsWrapper = ({ tutoringData, files }: ChartsWrapperProps) => {
  const [chartType, setChartType] = useState<"Pie Chart" | "Bar Chart">(
    "Pie Chart"
  );

  const transformedData = useTransformedData(tutoringData, chartType);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {transformedData.length > 0 && (
        <Tabs defaultValue="Pie Chart" className="w-full space-y-6">
          <TabsList className="w-full">
            <TabsTrigger
              onClick={() => setChartType("Pie Chart")}
              value="Pie Chart"
            >
              Pie Chart
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setChartType("Bar Chart")}
              value="Scatter Plot"
            >
              Bar Chart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Pie Chart">
            <ChartPie transformedData={transformedData} />
          </TabsContent>
          <TabsContent className="mr-6" value="Scatter Plot">
            <ChartBar transformedData={transformedData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ChartsWrapper;
