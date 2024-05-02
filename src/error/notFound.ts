export default class NotFoundError extends Error {
  constructor(message: string = "404 Not found") {
    super(message);
  }
}
