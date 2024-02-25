import { ExcelTutoringSessionData } from "@/lib/types";

type TutoringDataProps = {
  tutoringData: ExcelTutoringSessionData[] | null;
};

export default function TutoringData({ tutoringData }: TutoringDataProps) {
  return (
    <>{tutoringData && <pre>{JSON.stringify(tutoringData, null, 2)}</pre>}</>
  );
}
