import { Credentials, DatabaseType, ENUMUpdateForName, UpdateForName } from "@/@types";
import { FreqtyToken } from "@/model";
import logger from "@/utils/logger";
import { scrapPandaToken } from "@/functions/scrap-panda-token";

export async function updatePandaToken({ email, password, name }: Credentials): Promise<void> {
  if (!Object.keys(ENUMUpdateForName).includes(name)) {
    throw new Error(`unsupported credentials name`);
  }

  // obtain panda token from credentials
  const pandaToken = await scrapPandaToken({ email, password }, true);
  if (!pandaToken) {
    throw new Error('panda token not found');
  }

  logger.debug(`panda token for ${name}: ${pandaToken}`);

  const tokenFound = await FreqtyToken.findOne({ name });
  if (!tokenFound) {
    throw new Error(`token document not found for ${name}`);
  }

  tokenFound.token = pandaToken;
  tokenFound.updatedAt = new Date();
  await tokenFound.save();

  logger.info(`finish updating token for ${name}`);
}
