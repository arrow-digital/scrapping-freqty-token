import { Credentials, DatabaseType, ENUMUpdateForType, UpdateForType } from "@/@types";
import { FreqtyToken } from "@/model";
import logger from "@/utils/logger";
import { scrapPandaToken } from "@/functions/scrap-panda-token";

export async function updatePandaToken({ email, password }: Credentials, forType: UpdateForType, database: DatabaseType): Promise<void> {
  if (!Object.keys(ENUMUpdateForType).includes(forType)) {
    throw new Error(`unsupported credentials type`);
  }

  logger.info('start scrapping for database: ' + database);

  // obtain panda token from credentials
  const pandaToken = await scrapPandaToken({ email, password });
  if (!pandaToken) {
    throw new Error('panda token not found');
  }

  logger.debug(`panda token: ${pandaToken}`);

  // const tokenFound = await FreqtyToken.findById("6706b4fa394b9035255370a8");
  // if (!tokenFound) {
  //   throw new Error("token not found");
  // }

  // tokenFound.token = pandaToken;
  // await tokenFound.save();

  logger.info('finish scrapping');
}
