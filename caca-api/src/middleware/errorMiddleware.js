/**
 * @file Backend error handling and routing failure middleware for the CACA API.
 * Intercepts unresolved application routes to throw 404 errors and catches all upstream runtime,
 * validation, or database conflict exceptions to dispatch unified JSON error responses to the client.
 */

/**
 * Catch-all middleware triggered when an incoming HTTP request fails to match any defined API endpoint.
 * Dynamically builds a descriptive routing error and moves execution to the centralized handler.
 *
 * @param {Object} req - Express request object used to read the targeted path via originalUrl.
 * @param {Object} res - Express response object utilized to set the initial 404 HTTP status code.
 * @param {Function} next - Express next middleware pipeline execution callback containing the generated Error object.
 */
export function notFound(req, res, next) {
  const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

/**
 * Centralized application error handling middleware that captures all synchronous and asynchronous pipeline failures.
 * Evaluates error properties to securely format Mongoose validation bugs and MongoDB index conflicts into clean payloads.
 *
 * @param {Object} error - The generic or operational error object intercepted from upstream handlers.
 * @param {Object} req - Express request object mapping out the active client connection stream.
 * @param {Object} res - Express response object used to transmit the final unified error state status and payload.
 * @param {Function} next - Express next middleware pipeline execution callback trigger.
 */
export function errorHandler(error, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = error.message || 'Erro interno do servidor';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((err) => err.message).join(', ');
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'Email já registado';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}