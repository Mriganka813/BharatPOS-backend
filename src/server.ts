import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import app from "app";
import { Logger } from "utils/logger";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  app.listen(process.env.PORT, () => {
    Logger.info(`Server is working on http://localhost:${process.env.PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    Logger.info("Closing");
    await prisma.$disconnect();
    process.exit(1);
  });
