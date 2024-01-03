import { AskMeSet } from "@/types";
import { getSetQueryString } from "@/utils/getQueryString";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AskMeSet>,
) {
  const { ids } = req.query;
  const result = await fetch(getSetQueryString(ids as string));
  const set = await result.json();
  //console.log(set)
  const apiStatus = result.status;
  res.status(apiStatus).json(set);
}
