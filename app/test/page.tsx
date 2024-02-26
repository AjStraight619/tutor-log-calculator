import { prisma } from "@/prisma/prisma";

const TestPage = async () => {
  const tutoringData = await prisma.tutoringSession.findMany();
  return (
    <pre className="flex flex-col items-center justify-start min-h-screen p-12">
      {JSON.stringify(tutoringData, null, 2)}
    </pre>
  );
};

export default TestPage;
