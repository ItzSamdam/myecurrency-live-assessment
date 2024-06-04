import { Application } from "express";

/**
 * This is the abstract class and must not be instantiated
 */
/**
 * Base class for configuring routes in an application.
 */
abstract class BaseRoutesConfig {
  protected app: Application;
  protected name: string;

  /**
   * Creates an instance of BaseRoutesConfig.
   * @param app - The Express application object.
   * @param name - The name of the routes configuration.
   */
  constructor(app: Application, name: string) {
    this.app = app;
    this.name = name;
    this.configureRoutes();
  }

  /**
   * Gets the name of the routes configuration.
   * @returns The name of the routes configuration.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Configures the routes for the application.
   * @returns The configured Express application object.
   */
  abstract configureRoutes(): Application;
}

export default BaseRoutesConfig;
