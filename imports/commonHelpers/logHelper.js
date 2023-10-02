import * as Sentry from "@sentry/node";

function toConsole(message) {
  if (!!console && !!console.log) {
    console.log(message);
  }
}

export function logMessage(message) {
  toConsole(message);
  
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message);
  }
}

export function logError(error) {
  toConsole(error);

  if (process.env.SENTRY_DSN) {
    Sentry.captureException(message);
  }
}
