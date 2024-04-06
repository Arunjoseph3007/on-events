import { RequestHandler } from "express";
import { ZodSchema } from "zod";

export default function validate<TRequestBody>(
  schema: ZodSchema<TRequestBody>
): RequestHandler<{}, any, TRequestBody> {
  return function handle(req, _, next) {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
}
