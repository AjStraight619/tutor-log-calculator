"use client";
import { ExcelTutoringSessionData, FileData } from "@/lib/types";
import { useCallback, useState } from "react";
import ChartsWrapper from "./charts/charts-wrapper";
import DataTable from "./data-table";
import FilePreview from "./file-preview";
import UploadFiles from "./upload-files";

const Main = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [tutoringData, setTutoringData] = useState<ExcelTutoringSessionData[]>(
    []
  );

  const removeFileData = useCallback((fileName: string) => {
    setTutoringData((prevData) =>
      prevData.filter((data) => data.filename !== fileName)
    );
    setFiles((prevFiles) => {
      return prevFiles.filter((file) => file.file.name !== fileName);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full items-center justify-between">
      <UploadFiles files={files} setFiles={setFiles} />
      <FilePreview
        files={files}
        setFiles={setFiles}
        setTutoringData={setTutoringData}
        removeFileData={removeFileData}
      />
      <ChartsWrapper tutoringData={tutoringData} files={files} />
      <DataTable tutoringData={tutoringData} />
    </div>
  );
};

export default Main;
