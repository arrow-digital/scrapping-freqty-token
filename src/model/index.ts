import mongoose from "mongoose";

import { FreqtyTokenType } from "@/@types";

const freqtyTokenSchema = new mongoose.Schema<FreqtyTokenType>({
  token: {
    type: String,
    required: true,
  },
});

export const FreqtyToken = mongoose.model("FreqtyToken", freqtyTokenSchema);
