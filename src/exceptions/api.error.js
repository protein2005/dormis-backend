module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static Unauthorized() {
    return new ApiError(401, 'User is not authorized');
  }

  static Forbidden() {
    return new ApiError(403, 'Access to the resource is forbidden');
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }
}