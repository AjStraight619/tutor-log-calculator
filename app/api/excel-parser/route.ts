import ExcelJS from "exceljs";

type ExcelTutoringSessionData = {
  date?: Date;
  studentName?: string;
  studentId?: string;
  subject?: string;
  topicsCovered?: string;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (file && file instanceof File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tutoringSessions = await parseExcel(buffer);
    return Response.json(tutoringSessions);
  }
}

async function parseExcel(
  fileBuffer: Buffer
): Promise<ExcelTutoringSessionData[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.getWorksheet(1);
  const tutoringSessions: ExcelTutoringSessionData[] = [];

  worksheet?.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    // Skipping the header rows and any row without a date
    if (rowNumber <= 3 || !row.getCell(1).value) {
      return;
    }

    const session: ExcelTutoringSessionData = {};
    const dateCell = row.getCell(1).value;
    const nameCell = row.getCell(2).value;
    const studentIdCell = row.getCell(3).value;
    const subjectCell = row.getCell(4).value;
    const topicsCell = row.getCell(5).value;

    if (dateCell) {
      session.date = new Date(dateCell as string);
    }
    if (nameCell) {
      session.studentName = nameCell.toString();
    }
    if (studentIdCell) {
      session.studentId = studentIdCell.toString();
    }
    if (subjectCell) {
      session.subject = subjectCell.toString();
    }
    if (topicsCell) {
      session.topicsCovered = topicsCell.toString();
    }

    tutoringSessions.push(session);
  });

  return tutoringSessions;
}
