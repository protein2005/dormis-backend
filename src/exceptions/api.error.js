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
    return new ApiError(401, 'Користувач не авторизований');
  }

  static Forbidden() {
    return new ApiError(403, 'Доступ заборонено');
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }
}