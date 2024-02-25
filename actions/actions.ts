"use server";
import { ExcelTutoringSessionData } from "@/lib/types";
import ExcelJS from "exceljs";

export async function parse(formData: FormData) {
  const files = formData.getAll("files") as File[];

  const allTutoringSessions: ExcelTutoringSessionData[] = [];

  for (const file of files) {
    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tutoringSessions = await parseExcel(buffer, file.name);
      allTutoringSessions.push(...tutoringSessions);
    }
  }
  console.log(
    "All Tutoring Sessions:",
    JSON.stringify(allTutoringSessions, null, 2),
    " Tutoring Sessions Count: ",
    allTutoringSessions.length
  );
  return allTutoringSessions;
}

async function parseExcel(
  fileBuffer: Buffer,
  fileName: string
): Promise<ExcelTutoringSessionData[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.getWorksheet(1);
  const tutoringSessions: ExcelTutoringSessionData[] = [];

  worksheet?.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= 3) {
      return;
    }

    const subjectCell = row.getCell(4).value;

    if (subjectCell) {
      const session: ExcelTutoringSessionData = {
        filename: fileName,
      };
      const dateCell = row.getCell(1).value;
      const nameCell = row.getCell(2).value;
      const studentIdCell = row.getCell(3).value;
      const topicsCell = row.getCell(5).value || "No Specific Topic Listed";

      if (dateCell) {
        session.date = new Date(dateCell as string);
      }
      if (nameCell) {
        session.studentName = nameCell.toString();
      }
      if (studentIdCell) {
        session.studentId = studentIdCell.toString();
      }

      session.subject = subjectCell.toString();
      session.topicsCovered = topicsCell.toString();
      tutoringSessions.push(session);
    }
  });

  return tutoringSessions;
}
