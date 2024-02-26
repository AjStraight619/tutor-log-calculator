import Main from "@/components/main";
import { prisma } from "@/prisma/prisma";

const getTutoringData = async () => {
  return await prisma.tutoringSession.findMany();
};

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between container mx-auto min-h-screen p-24">
      <Main />
    </main>
  );
}
