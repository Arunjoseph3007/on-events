import type { Express } from "express";
import NotFoundError from "../error/notFound";
import UnAuthorizedError from "../error/unauthorized";
import { AssertionError } from "assert";
import CustomHttpError from "../error/httpError";

declare module "express-serve-static-core" {
  interface Response {
    notFound: (message?: string) => never;
    unauthorized: (message?: string) => never;
    error: (code: number, message?: string) => never;
    assert: <T>(condition: T) => asserts condition is NonNullable<T>;
  }
}

export default function setupResErrors(app: Express) {
  app.response.notFound = (message) => {
    throw new NotFoundError(message);
  };

  app.response.unauthorized = (message) => {
    throw new UnAuthorizedError(message);
  };

  app.response.assert = function (condition) {
    if (!condition) {
      throw new AssertionError({
        message: "Assertion error",
        actual: condition,
        expected: "truthy",
      });
    }
  };

  app.response.error = (code, message) => {
    throw new CustomHttpError(
      code,
      message || "Something went wrong. HTTP Error"
    );
  };
}
