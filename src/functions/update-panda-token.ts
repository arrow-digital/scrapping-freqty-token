import { Credentials } from "@/@types";
import { FreqtyToken } from "@/model";
import { scrappingPandaToken } from "@/utils/scrapping-token";

export async function updatePandaToken({ email, password }: Credentials) {
  console.log(`[${new Date().toLocaleString()}] Start scrapping\n`);

  const pandaToken = await scrappingPandaToken({ email, password });
  if (!pandaToken) {
    throw new Error("panda token not found");
  }

  // const tokenFound = await FreqtyToken.findById("6706b4fa394b9035255370a8");
  // if (!tokenFound) {
  //   throw new Error("token not found");
  // }

  // tokenFound.token = pandaToken;
  // await tokenFound.save();

  console.log(`[${new Date().toLocaleString()}] Finish scrapping\n`);
}
