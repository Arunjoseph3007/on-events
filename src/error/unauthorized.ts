export default class UnAuthorizedError extends Error {
  constructor(public readonly error?: any) {
    super("User is not authorized");
  }
}
