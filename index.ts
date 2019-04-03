import { CISSubscriber } from './src/classes/cis-subscriber';
import { Server } from "./src/server";

(async () => {
  await new Server().start();
  CISSubscriber.subscribe();
})();