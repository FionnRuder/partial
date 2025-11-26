import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  const deletionOrder = [...modelNames].reverse();

  for (const modelName of deletionOrder) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function resetSequences() {
  const sequenceNames = [
    '"Organization_id_seq"',
    '"Attachment_id_seq"',
    '"Comment_id_seq"',
    '"WorkItemToPart_id_seq"',
    '"WorkItem_id_seq"',
    '"Milestone_id_seq"',
    '"Part_id_seq"',
    '"DisciplineTeamToProgram_id_seq"',
    '"Program_id_seq"',
    '"User_userId_seq"',
    '"DisciplineTeam_id_seq"',
    '"DeliverableType_id_seq"',
    '"IssueType_id_seq"',
  ];

  for (const sequence of sequenceNames) {
    try {
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE ${sequence} RESTART WITH 1;`);
      console.log(`Reset sequence ${sequence}`);
    } catch (error) {
      console.error(`Error resetting sequence ${sequence}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "organization.json",
    "deliverableType.json",
    "issueType.json",
    "disciplineTeam.json",
    "user.json",
    "program.json",
    "disciplineTeamToProgram.json",
    "part.json",
    "milestone.json",
    "workItem.json",
    "deliverableDetail.json",
    "issueDetail.json",
    "workItemToPart.json",
    "comment.json",
    "attachment.json",
  ];

  // Delete dependent tables first (StatusLog, Invitation, Feedback)
  try {
    await prisma.statusLog.deleteMany({});
    console.log("Cleared data from StatusLog");
  } catch (error) {
    console.error("Error clearing data from StatusLog:", error);
  }
  try {
    await prisma.invitation.deleteMany({});
    console.log("Cleared data from Invitation");
  } catch (error) {
    console.error("Error clearing data from Invitation:", error);
  }
  try {
    await prisma.feedback.deleteMany({});
    console.log("Cleared data from Feedback");
  } catch (error) {
    console.error("Error clearing data from Feedback:", error);
  }

  await deleteAllData(orderedFileNames);
  await resetSequences();

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());