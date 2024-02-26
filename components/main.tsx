"use client";
import { ExcelTutoringSessionData } from "@/lib/types";
import { Suspense, useCallback, useState } from "react";
import ChartsWrapper from "./charts/charts-wrapper";
import DataTable from "./data-table";
import FilePreview from "./file-preview";
import UploadFiles from "./upload-files";

const testData = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
];

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
    <div className="flex flex-col gap-4 h-full items-center justify-between">
      <Suspense fallback={<div>Loading...</div>}>
        <UploadFiles
          files={files}
          setFiles={setFiles}
          setFileData={setTutoringData}
        />
      </Suspense>
      <FilePreview
        files={files}
        setFiles={setFiles}
        removeFileData={removeFileData}
      />
      <ChartsWrapper tutoringData={tutoringData} files={files} />
      <DataTable tutoringData={tutoringData} />
    </div>
  );
};

export default Main;
