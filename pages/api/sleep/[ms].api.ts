import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = Number(req.query.ms);

  if (Number.isNaN(query) || query < 0) {
    res.status(400);
    return;
  }

  await new Promise((r) => setTimeout(r, query));
  res.status(204).end();
}
