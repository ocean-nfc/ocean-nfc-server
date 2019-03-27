import { Database } from './database';
import { InvalidParamSuppliedException, Exception } from './../exceptions';
import * as express from "express";
import { NotAllParamsSuppliedException } from "../exceptions";

export enum HttpMethod {
  GET = "GET",
  POST = "POST"
}

/**
 * Abstract class for wrapping Express routing
 */
export abstract class Route {
  /// the url of the endpoint (must start with /)
  abstract getEndpoint(): string;
  /// the method of the endpoint (HttpMethod: GET or POST)
  abstract getMethod(): HttpMethod;
  /// an example response. Must be a JSON object.
  exampleResponse: {[s: string]: any} = null;
  /// list of parameters the route expects
  parameters: RouteParam[] = [];
  /// description of what this route does
  description: string = "";
  /// list of side effects caused by this route (e.g. sends a notification containing x)
  sideEffects: string[] = [];

  protected db: Database = Database.getInstance();

  /**
   * Registers the route on the application
   * @param app 
   */
  public register(app: express.Application) {
    const registerFn = this.getMethod() == HttpMethod.GET ? app.get : app.post;
    registerFn.call(app, this.getEndpoint(), this.route);
  }
  
  /**
   * The route function passed to Express
   */
  private route = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const params = {};

    // validate that all of the parameters have been given
    for (const param of this.parameters) {
      const paramValue = req.query[param.getName()];

      // throw an error if the parameter has not been given
      if (typeof paramValue === 'undefined') {
        return next(new NotAllParamsSuppliedException({
          parameter: param.getName(),
          example: param.getExample()
        }));
      }

      // validate that the parameter is valid
      const isValid = await param.isValid(paramValue);
      if (!isValid) {
        return next(new InvalidParamSuppliedException({
          parameter: param.getName(),
          value: paramValue,
          example: param.getExample()
        }));
      }

      params[param.getName()] = paramValue;
    }

    // all parameters have been given and are valid

    try {
      res.json(await this.apiFunction(params));
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  /**
   * Defines the functionality that the route performs.
   * The returned value of this function is sent as JSON to the client.
   * @param params Object containing the parameters of the request. Only includes
   * parameters that are included in the parameters array.
   */
  protected abstract async apiFunction(params: {[key: string]: string}): Promise<any>;
}


/**
 * Route parameter class for Route
 */
export class RouteParam {
  /**
   * 
   * @param name The name of the parameter (provided in the HTTP request)
   * @param validator An asynchronous function that validates whether the parameter is valid
   */
  constructor(
    private name: string,
    private example: string,
    public validator: (value: any) => Promise<boolean>
  ) {}

  public getName() {
    return this.name;
  }

  public isValid(value: any): Promise<boolean> {
    return this.validator(value);
  }

  public getExample() {
    return this.example;
  }
}
