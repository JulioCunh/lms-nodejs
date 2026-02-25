import type { CustomRequest } from "./custom-request.ts";
import type { CustomResponse } from "./custom-response.ts";

type Handler = (
  req: CustomRequest,
  res: CustomResponse
) => Promise<void> | void;

type Routes = Record<string, Handler>;

type RouteMethods = {
  GET: Routes;
  POST: Routes;
};

export class Router {
  routes: RouteMethods = {
    GET: {},
    POST: {},
  };

  get(route: string, handler: Handler) {
    this.routes['GET'][route] = handler;
  }

  post(route: string, handler: Handler) {
    this.routes['POST'][route] = handler;
  }

  find(method: string, route: string) {
    return this.routes[method as keyof RouteMethods]?.[route] || null;
  }
}