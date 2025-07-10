import type { Logger } from 'winston';
import type winston from 'winston';
import { createLogger, format, transport, transports } from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';

/**
 * Human-readable format with timestamps, colors, and detailed error info
 */
const logFormat = (
  format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.colorize(),
    format.printf(({ timestamp, level, message, error_message, error_stack, error_name, ...meta }) => {
      let output = `${timestamp} ${level}: ${message}`;

      if (error_message) {
        output += `\nError Message: ${error_message}`;
      }

      if (error_name) {
        output += `\nError Name: ${error_name}`;
      }

      if (error_stack) {
        output += `\nStack Trace:\n${error_stack}`;
      }

      const remainingMeta = Object.keys(meta).length ? `\nLog Metadata: ${JSON.stringify(meta, null, 2)}` : '';

      return `${output}${remainingMeta}`;
    })
  )
);

/**
 * Configure log transports
 * Uses Console output
 */
const loggerTransports: winston.transport[] = [new transports.Console()];

/**
 * Structured logger for application events.
 *
 * IMPORTANT: The `log_event` field is required for error logs and is used for GCP alerting.
 * Always use LOG_EVENTS enum values for the `log_event` field in error logs.
 * `error` fields is also required for error logs and should be an Error object or a string.
 */
class TypedLogger {
  private logger: Logger;

  constructor() {
    const { S3_ACCESSS_KEY_ID, S3_SECRET_ACCESS_KEY, AWS_REGION } = process.env;
    if (S3_ACCESSS_KEY_ID && S3_SECRET_ACCESS_KEY) {
      loggerTransports.push(
        new CloudWatchTransport({
          logGroupName: '/aws/ec2/linkio-freqty',
          logStreamName: () => {
            // Create unique stream name with timestamp
            return `${new Date().toISOString().split('T')[0]}`;
          },
          awsOptions: {
            credentials: {
              accessKeyId: S3_ACCESSS_KEY_ID,
              secretAccessKey: S3_SECRET_ACCESS_KEY,
            },
            region: AWS_REGION || 'sa-east-1',
          },
          messageFormatter: ({ level, message, ...additionalInfo }) => {
            // eslint-disable-next-line no-control-regex
            const cleanMessage = message.replace(/\u001b\[[0-9;]*m/g, '');
            // eslint-disable-next-line no-control-regex
            const cleanLevel = level.replace(/\u001b\[[0-9;]*m/g, '');

            return `[${cleanLevel}] ${cleanMessage} ${JSON.stringify(additionalInfo) ?? ''}`;
          },
        })
      );
    }

    this.logger = createLogger({
      level: 'debug',
      format: logFormat,
      transports: loggerTransports,
    });
  }

  // Safely log messages to prevent logging errors from crashing the application
  // If an error occurs while logging, the original message and metadata are logged to the console
  private safeLog(method: 'error' | 'info' | 'warn' | 'debug', message: string) {
    try {
      this.logger[method](message);
    } catch (err) {
      console.error('Logging error:', err);
      console.error('Original log message:', message);
    }
  }

  /**
   * Logs an error message with required metadata
   * @param message - Error message to log
   * @param metadata - Must include LOG_METADATA.EVENT from LEG_EVENTS enum
   *                   Must include LOG_METADATA.ERROR with an Error object or string
   * @throws {Error} If metadata is missing required fields
   */
  error(message: string): void {
    this.safeLog('error', message);
  }

  info(message: string): void {
    this.safeLog('info', message);
  }

  warn(message: string): void {
    this.safeLog('warn', message);
  }

  debug(message: string): void {
    this.safeLog('debug', message);
  }
}

const logger = new TypedLogger();
export default logger;
