import { ExcelTutoringSessionData } from "@/lib/types";
import { prisma } from "@/prisma/prisma";
import ExcelJS from "exceljs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files: File[] | null = formData.getAll("files") as unknown as File[];
  if (!files || files.length === 0) {
    return NextResponse.json({ success: false, message: "No files found" });
  }

  const parsePromises = files.map(async (file) => {
    if (file instanceof File) {
      return file.arrayBuffer().then((bytes) => {
        const buffer = Buffer.from(bytes);
        return parseExcel(buffer, file.name);
      });
    }
    return Promise.resolve([]);
  });

  try {
    const results = await Promise.all(parsePromises);
    const allTutoringSessions = results.flat();
    if (allTutoringSessions.length > 0) {
      const fileName = allTutoringSessions[0].filename;
      const tutorName = "name";
      await saveToDatabase(allTutoringSessions, fileName, tutorName);
    }

    return NextResponse.json({ success: true, data: allTutoringSessions });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error processing files",
      error: error,
    });
  }
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
    if (rowNumber <= 4) {
      return;
    }

    const subjectCell = row.getCell(4).value;
    if (subjectCell) {
      const session: ExcelTutoringSessionData = {
        filename: fileName,
        date: new Date(),
        studentName: "",
        studentId: "",
        subject: "",
        topicsCovered: "",
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

async function saveToDatabase(
  tutoringSessions: ExcelTutoringSessionData[],
  filename: string | undefined,
  tutorName: string
) {
  const batch = await prisma.tutoringSessionBatch.create({
    data: {
      fileName: filename || "No file name",
      tutorName: tutorName,
    },
  });

  for (const session of tutoringSessions) {
    await prisma.tutoringSession.create({
      data: {
        batchId: batch.id,
        date: session.date,
        studentName: session.studentName,
        studentId: session.studentId,
        subject: session.subject,
        topicsCovered: session.topicsCovered,
      },
    });
  }
}
