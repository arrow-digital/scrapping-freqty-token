import "dotenv/config";
import cron from "node-cron";

import { connectMongo } from "./utils/mongo";
import { updatePandaToken } from "./functions/update-panda-token";
import logger from "./utils/logger";

async function main() {
  try {
    await connectMongo();

    logger.info('mongo connected');
    logger.info('service is running');

    const { EMAIL_AUTH_PANDA, PASSWORD_AUTH_PANDA } = process.env;
    if (!EMAIL_AUTH_PANDA || !PASSWORD_AUTH_PANDA) {
      throw new Error('environment variables must be declared');
    }

    // Every 1 minutes runs cron job
    // cron.schedule("*/1 * * * *", () =>
    //   updatePandaToken({ email: EMAIL_AUTH_PANDA, password: PASSWORD_AUTH_PANDA }),
    // );

    // Every 12 AM and 12 PM runs cron job
    // cron.schedule("0 0 0,12 * * *", () =>
      updatePandaToken({ email: EMAIL_AUTH_PANDA, password: PASSWORD_AUTH_PANDA });
    // );
  } catch (error) {
    logger.error(`${JSON.stringify(error)}`);
  }
}

main();
