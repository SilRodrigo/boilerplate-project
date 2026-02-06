import { config } from "dotenv";

import { httpServer } from "./server";
import { PORT_APP } from "./core/config";
import { prismaClient } from "./libs/PrismaClient";
import "./container";
import { GameGateway } from "./runtime/gateways/gameGateway";

config();

new GameGateway(httpServer);

httpServer.listen(PORT_APP || 3333, () => {
  console.clear();
  prismaClient.$connect()
    .then(() => {
      console.log(`Server running on port ${PORT_APP}`);
      console.log(`Database connected`);
    })
    .catch((err: unknown) => {
      console.error(err);
      prismaClient.$disconnect();
      process.exit(1);
    });
});
