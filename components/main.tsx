"use client";
import { ExcelTutoringSessionData } from "@/lib/types";
import { useCallback, useState } from "react";
import ChartPie from "./charts/pie-chart";
import DataTable from "./data-table";
import FilePreview from "./file-preview";
import UploadFiles from "./upload-files";

const Main = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [tutoringData, setTutoringData] = useState<ExcelTutoringSessionData[]>(
    []
  );

  const removeFileData = useCallback((fileName: string) => {
    setTutoringData((prevData) =>
      prevData.filter((data) => data.filename !== fileName)
    );
    setFiles((prevFiles) => {
      return prevFiles.filter((file) => file.name !== fileName);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full w-full items-center justify-center">
      <UploadFiles
        files={files}
        setFiles={setFiles}
        setFileData={setTutoringData}
      />
      <FilePreview
        files={files}
        setFiles={setFiles}
        removeFileData={removeFileData}
      />
      {/* <TutoringData tutoringData={tutoringData} /> */}
      <ChartPie tutoringData={tutoringData} files={files} />
      <DataTable tutoringData={tutoringData} />
    </div>
  );
};

export default Main;
