import { ExcelTutoringSessionData, FileData } from "@/lib/types";

import { uploadFiles } from "@/actions/upload-files";
import { getErrorMessage } from "@/lib/utils";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import SubmitButton from "./ui/submit-button";

type FilePreviewProps = {
  files: FileData[];
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  setTutoringData: React.Dispatch<
    React.SetStateAction<ExcelTutoringSessionData[]>
  >;
  removeFileData: (fileName: string) => void;
};

const FilePreview = ({
  files,
  setFiles,
  setTutoringData,
  removeFileData,
}: FilePreviewProps) => {
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (formData: FormData) => {
    files.forEach((file, index) => {
      formData.append(`files`, file.file);
    });

    const { data, success, error } = await uploadFiles(formData);

    console.log(data);

    if (success && data) {
      setTutoringData(data);
      setFiles([]);
    } else {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      {files.length > 0 && (
        <form action={handleUpload}>
          <Card>
            <CardHeader>
              <CardTitle className="self-center">Files To Upload</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center gap-2">
              <ul className="list-disc">
                {files.map((file) => (
                  <li className="flex flex-col gap-2" key={file.file.name}>
                    <Input
                      ref={inputRef}
                      required
                      className="text-muted-foreground"
                      type="text"
                      name="tutorName"
                      placeholder="Tutor Name"
                      defaultValue={file.tutorName || ""}
                    />
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-[calc(100%-3rem)]">
                        {file.file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFileData(file.file.name)}
                      >
                        <X size={15} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {/* <ul className="list-disc space-y-2">
                {files.map((file, index) => (
                  <li
                    className="min-w-[8rem] flex items-center justify-between"
                    key={index}
                  >
                    <div className="flex flex-col gap-1">
                      <Input defaultValue="Alex Straight" />
                      <span className="truncate max-w-[calc(100%-3rem)]">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFileData(file.name)}
                    >
                      <X size={15} />
                    </Button>
                  </li>
                ))}
              </ul> */}
            </CardContent>
            <CardFooter className="justify-end">
              <SubmitButton>Upload Files</SubmitButton>
            </CardFooter>
          </Card>
        </form>
      )}
    </>
  );
};

export default FilePreview;
