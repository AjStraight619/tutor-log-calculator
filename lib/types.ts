export type ExcelTutoringSessionData = {
  tutorName?: string;
  filename?: string;
  date?: Date;
  studentName?: string;
  studentId?: string;
  subject?: string;
  topicsCovered?: string;
};

export type TransformedData = {
  name: string;
  value: number;
};

export type FileData = {
  file: File;
  tutorName?: string;
};
