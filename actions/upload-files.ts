"use server";
import { ExcelTutoringSessionData, FileData } from "@/lib/types";
import { prisma } from "@/prisma/prisma";
import ExcelJS from "exceljs";

export const uploadFiles = async (formData: FormData) => {
  const files: FileData[] | null = formData.getAll(
    "files"
  ) as unknown as FileData[];
  const tutorNames = formData.getAll("tutorName") as string[];

  if (!files || files.length === 0) {
    return { success: false, message: "No files found" };
  }

  console.log("tutorNames", tutorNames);

  const parsePromises = files.map(async (file, index) => {
    if (file instanceof File) {
      return file.arrayBuffer().then((bytes) => {
        const buffer = Buffer.from(bytes);
        return parseExcel(buffer, file.name, tutorNames[index]);
      });
    }
    return Promise.resolve([]);
  });

  try {
    const results = await Promise.all(parsePromises);
    const allTutoringSessions = results.flat();
    if (allTutoringSessions.length > 0) {
      const fileName = allTutoringSessions[0].filename;
      //   await saveToDatabase(allTutoringSessions, fileName);
    }

    return { success: true, data: allTutoringSessions };
  } catch (error) {
    return {
      success: false,
      message: "Error processing files",
      error: error,
    };
  }
};

async function parseExcel(
  fileBuffer: Buffer,
  fileName: string,
  tutorName: string
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
        tutorName: tutorName || "",
        filename: fileName,
        date: undefined,
        studentName: "",
        studentId: "",
        subject: "",
        topicsCovered: "",
      };

      const dateCell = row.getCell(1).value || "N/A";
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
  filename: string | undefined
) {
  const batch = await prisma.tutoringSessionBatch.create({
    data: {
      fileName: filename || "No file name",
      tutorName: tutoringSessions[0].tutorName || "No tutor name",
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
