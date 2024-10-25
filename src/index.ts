import "dotenv/config";
import cron from "node-cron";

import { connectMongo } from "./utils/mongo";
import { updatePandaToken } from "./functions/update-panda-token";

async function main() {
  try {
    await connectMongo();

    console.log(`[${new Date().toLocaleString()}] mongo connected`);
    console.log(`[${new Date().toLocaleString()}] service is running\n`);

    const { EMAIL_AUTH_PANDA, PASSWORD_AUTH_PANDA } = process.env;
    if (!EMAIL_AUTH_PANDA || !PASSWORD_AUTH_PANDA) {
      throw new Error("environment variables must be declare");
    }

    // Every 1 minutes runs cron job
    // cron.schedule("*/1 * * * *", () =>
    //   updatePandaToken({ email: EMAIL_AUTH_PANDA, password: PASSWORD_AUTH_PANDA }),
    // );

    // Every 12 AM and 12 PM runs cron job
    cron.schedule("0 0 0,12 * * *", () =>
      updatePandaToken({ email: EMAIL_AUTH_PANDA, password: PASSWORD_AUTH_PANDA }),
    );
  } catch (error) {
    console.log(`[${new Date().toLocaleString()}] Error: ${JSON.stringify(error)}\n`);
  }
}

main();
