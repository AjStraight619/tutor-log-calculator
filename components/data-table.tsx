import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExcelTutoringSessionData } from "@/lib/types";

type DataTableProps = {
  tutoringData: ExcelTutoringSessionData[] | null;
};

const DataTable = ({ tutoringData }: DataTableProps) => {
  return (
    <Table>
      <TableCaption>A list of tutoring sessions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Topics Covered</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tutoringData?.map((session, index) => (
          <TableRow key={index}>
            <TableCell>
              {session.date
                ? new Date(session.date).toLocaleDateString()
                : "N/A"}
            </TableCell>
            <TableCell>{session.studentName || "Anonymous"}</TableCell>
            <TableCell>{session.studentId || "N/A"}</TableCell>
            <TableCell>{session.subject || "Unspecified"}</TableCell>
            <TableCell>
              {session.topicsCovered || "No Specific Topic Listed"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
