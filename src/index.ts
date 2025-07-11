import "dotenv/config";

import cron from "node-cron";
import { connectMongo } from "./utils/mongo";
import { updatePandaToken } from "./functions/update-panda-token";
import logger from "./utils/logger";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Credentials } from "./@types";
import mongoose from "mongoose";

const obtainCredentials = (fileName: string = 'credentials.json'): Credentials[] => {
  let jsonFilePath = join(process.cwd(), fileName);
  if (!existsSync(jsonFilePath)) {
    throw new Error('credentials.json file not found in the root directory');
  }

  return JSON.parse(readFileSync(jsonFilePath, 'utf-8'));
}

async function main() {
  await connectMongo();

  logger.info('mongo connected');
  logger.info('service is running');

  // setup graceful shutdown handlers
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('beforeExit', () => gracefulShutdown('beforeExit'));

  // load up credentials from json file
  const credentials = obtainCredentials();
  logger.info('credentials loaded from file: ' + credentials.length);

  if (process.argv.includes('--run-once')) {
    // run once sequentially to update all tokens
    logger.info('running update tokens now');
    for (const credential of credentials) {
      try {
        logger.info(`updating token for ${credential.name}`);
        await updatePandaToken(credential);
      } catch (error) {
        logger.error(String(error));
      }
    }
    logger.info('all tokens updated successfully');
    await gracefulShutdown('run-once completed');
  }

  if (!process.argv.includes('--no-cron')) {
    // set cron job to update tokens every 12 hours
    logger.info('setting up cron job to update tokens every 12 hours');
    cron.schedule("0 0 0,12 * * *", () => {
    // cron.schedule("* * * * *", () => {
      logger.info('cron job started');
      const credentials = obtainCredentials();
      logger.info('credentials loaded from file: ' + credentials.length);
      for (const credential of credentials) {
        try {
          logger.info(`updating token for ${credential.name}`);
          updatePandaToken(credential)
            .catch((error) => {
              throw error;
            });
        } catch (error) {
          logger.error(String(error));
        }
      }
      logger.info('cron job completed');
    });
  }
  
}

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, closing mongoose connection...`);
  try {
    await mongoose.connection.close();
    logger.info('mongoose connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing mongoose connection: ' + error);
    process.exit(1);
  }
};

main();
