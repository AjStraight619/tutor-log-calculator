import { X } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

type FilePreviewProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  removeFileData: (fileName: string) => void;
};

const FilePreview = ({ files, setFiles, removeFileData }: FilePreviewProps) => {
  return (
    <ul className="list-disc space-y-2">
      {files.map((file, index) => (
        <li
          className="min-w-[8rem] flex items-center justify-between"
          key={index}
        >
          <span className="truncate max-w-[calc(100%-3rem)]">{file.name}</span>{" "}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFileData(file.name)}
          >
            <X size={15} />
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default FilePreview;
