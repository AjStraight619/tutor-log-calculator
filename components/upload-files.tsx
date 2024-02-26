/* eslint-disable react/no-unescaped-entities */
"use client";
import { FileData } from "@/lib/types";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import ExcelJS from "exceljs";

type UploadFilesProps = {
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
};

// const baseUrl =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000"
//     : "https://tutor-log-calculator.vercel.app";

const UploadFiles = ({ files, setFiles }: UploadFilesProps) => {
  const isDuplicate = useCallback(
    (fileName: string) => {
      return files.some((file) => file.file.name === fileName);
    },
    [files]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles = acceptedFiles.filter((file) => !isDuplicate(file.name));

      // Extract tutor names and create FileData objects
      const fileDataPromises = acceptedFiles.map(async (file) => {
        const tutorName = await extractTutorName(file);
        console.log(tutorName);
        console.log(typeof tutorName);
        return { file, tutorName };
      });

      const fileDataArray = await Promise.all(fileDataPromises);

      setFiles((prevFiles) => [...prevFiles, ...fileDataArray]);
    },
    [setFiles, isDuplicate]
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

async function extractTutorName(file: File): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer);
          const worksheet = workbook.getWorksheet(1);
          const tutorNameCell = worksheet?.getCell("A2");
          const tutorName = tutorNameCell?.value
            ?.toString()
            .split(":")[1]
            .trim();
          if (tutorName) {
            resolve(tutorName);
          } else {
            resolve("");
          }
        } else {
          console.error("Failed to load file as array buffer");
          resolve(undefined);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      reject(error); // Reject the promise on catching an error
    }
  });
}
