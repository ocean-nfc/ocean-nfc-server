import { GetClientIdFromCardNumberRoute } from './get-client-id-from-card-number';
import { AddCardRoute } from './add-card';

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
];