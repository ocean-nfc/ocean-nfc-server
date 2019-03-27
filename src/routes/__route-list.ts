import { VerifyPinByRfidRoute } from "./verify-pin-rfid";
import { GetClientIdFromCardNumberRoute } from "./get-client-id-from-card-number";
import { AddCardRoute } from "./add-card";
import { DeactByCardNumRoute } from "./deact-by-cardnum";
import { ListAllRoute } from "./list-all-clients";
import { DeactByClientIdRoute } from "./deact-by-clientId";
import { DeactByRfidRoute } from "./deact-by-rfid";
import { VerifyPinByCardNumberRoute } from "./verify-pin-card-number";

/**
 * List of all routes to be registered by the server.
 * Routes should be added here instead of directly to
 * the server class.
 *
 * This list is also used for documentation purposes.
 */
export const routes = [
  new AddCardRoute(),

  new GetClientIdFromCardNumberRoute(),

  new ListAllRoute(),

  new DeactByCardNumRoute(),
  new DeactByClientIdRoute(),
  new DeactByRfidRoute(),

  new VerifyPinByCardNumberRoute(),
  new VerifyPinByRfidRoute()
];
