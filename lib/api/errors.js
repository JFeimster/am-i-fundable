import { createRequestId } from "./response.js";

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = Number(options.statusCode || 500);
    this.code = options.code || "api_error";
    this.details = options.details || [];
    this.requestId = options.requestId || createRequestId("err");
  }
}

export function badRequest(message = "Invalid request.", details = []) {
  return new ApiError(message, { statusCode: 400, code: "bad_request", details });
}

export function methodNotAllowed(method, allowedMethods = []) {
  return new ApiError(`Method ${method || "UNKNOWN"} is not allowed.`, {
    statusCode: 405,
    code: "method_not_allowed",
    details: [{ allowedMethods }]
  });
}

export function notFound(message = "Resource not found.") {
  return new ApiError(message, { statusCode: 404, code: "not_found" });
}

export function privateBoundaryViolation(details = []) {
  return new ApiError("Public response failed safety boundary review.", {
    statusCode: 500,
    code: "public_boundary_violation",
    details
  });
}

export function validationError(details = []) {
  return new ApiError("Request validation failed.", {
    statusCode: 422,
    code: "validation_error",
    details
  });
}

export function toApiError(error) {
  if (error instanceof ApiError) return error;
  return new ApiError("Unexpected API error.", {
    statusCode: 500,
    code: "internal_error",
    details: error?.message ? [{ message: error.message }] : []
  });
}
