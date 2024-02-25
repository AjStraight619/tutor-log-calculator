/* eslint-disable react/no-unescaped-entities */
"use client";
import { parse } from "@/actions/actions";
import { ExcelTutoringSessionData } from "@/lib/types";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type UploadFilesProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setFileData: React.Dispatch<React.SetStateAction<ExcelTutoringSessionData[]>>;
};

const UploadFiles = ({ files, setFiles, setFileData }: UploadFilesProps) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("files", file);
      });
      const fileData = await parse(formData);
      setFileData((prevData) => [...prevData, ...fileData]);
    },
    [setFiles, setFileData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border p-4 border-dashed hover:cursor-pointer max-w-[28rem]"
    >
      <input {...getInputProps()} accept="xlsx" />
      {isDragActive ? (
        <p className="text-center">Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default UploadFiles;
