import { prisma } from "../prisma/prisma";

export async function getTutoringData() {
  return await prisma.tutoringSession.findMany();
}
