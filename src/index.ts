import "dotenv/config";

import { connectMongo } from "./utils/mongo";
import { updatePandaToken } from "./functions/update-panda-token";
import logger from "./utils/logger";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Credentials } from "./@types";

const obtainCredentials = (fileName: string = 'credentials.json'): Credentials[] => {
  let jsonFilePath = join(process.cwd(), fileName);
  if (!existsSync(jsonFilePath)) {
    throw new Error('credentials.json file not found in the root directory');
  }

  return JSON.parse(readFileSync(jsonFilePath, 'utf-8'));
}

async function main() {
  try {
    await connectMongo();

    logger.info('mongo connected');
    logger.info('service is running');

    // load up credentials from json file
    const credentials = obtainCredentials();
    logger.info('credentials loaded from file: ' + credentials.length);

    // Every 1 minutes runs cron job
    // cron.schedule("*/1 * * * *", () =>
    //   updatePandaToken({ email: EMAIL_AUTH_PANDA, password: PASSWORD_AUTH_PANDA }),
    // );

    // Every 12 AM and 12 PM runs cron job
    // cron.schedule("0 0 0,12 * * *", () =>
      for (const credential of credentials) {
        logger.info(`updating token for ${credential.name}`);
        await updatePandaToken(credential);
      }
    // );
  } catch (error) {
    logger.error(`${JSON.stringify(error)}`);
  }
}

main();
