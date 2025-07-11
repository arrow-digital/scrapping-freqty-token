import mongoose from "mongoose";

import { FreqtyTokenType } from "@/@types";

const freqtyTokenSchema = new mongoose.Schema<FreqtyTokenType>({
  token: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: false,
  }
});

export const FreqtyToken = mongoose.model("FreqtyToken", freqtyTokenSchema);
