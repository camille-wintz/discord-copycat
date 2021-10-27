import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json({
    channels: [
      {
        id: "611014873639550999",
        name: "présentations",
      },
      {
        id: "571286115739238410",
        name: "dev-test",
      },
      {
        id: "675919773607002148",
        name: "dev-room",
      },
      {
        id: "572532173056507905",
        name: "streams-announcements",
      },
      {
        id: "656504373290991643",
        name: "party",
      },
    ],
    users: [
      {
        id: "258258856189231104",
        username: "Brendan",
        discriminator: "1234",
      },
      {
        id: "138362511190786048",
        username: "Brendon",
        discriminator: "4321",
      },
      {
        id: "103559217914318848",
        username: "JohnL",
        discriminator: "3234",
      },
      {
        id: "759336655478849578",
        username: "JohnD",
        discriminator: "4322",
      },
    ],
  });
}
