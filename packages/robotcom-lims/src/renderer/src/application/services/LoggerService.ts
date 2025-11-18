/**
 * LoggerService - Comprehensive logging and error tracking
 * Handles all application logging, error reporting, and diagnostics
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  stack?: string;
  userId?: string;
}

class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private currentUserId?: string;

  /**
   * Initialize logger with optional user ID
   */
  setUserId(userId: string): void {
    this.currentUserId = userId;
  }

  /**
   * Log at DEBUG level (development only)
   */
  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Log at INFO level
   */
  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log at WARN level
   */
  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log at ERROR level
   */
  error(message: string, error?: Error | unknown, context?: string): void {
    const stack = error instanceof Error ? error.stack : undefined;
    const data = error instanceof Error ? { message: error.message } : error;
    this.log(LogLevel.ERROR, message, data, context, stack);
  }

  /**
   * Log at FATAL level (critical errors)
   */
  fatal(message: string, error?: Error | unknown, context?: string): void {
    const stack = error instanceof Error ? error.stack : undefined;
    const data = error instanceof Error ? { message: error.message } : error;
    this.log(LogLevel.FATAL, message, data, context, stack);
  }

  /**
   * Main logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string,
    stack?: string
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      stack,
      userId: this.currentUserId
    };

    // Add to internal log buffer
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Keep only last 1000 logs
    }

    // Console output
    this.printToConsole(entry);

    // Could be extended to send to remote service in production
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.reportToService(entry);
    }
  }

  /**
   * Print formatted log to console
   */
  private printToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level}]`;
    const context = entry.context ? ` [${entry.context}]` : '';
    const fullMessage = `${prefix}${context} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(fullMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(fullMessage, entry.data);
        if (entry.stack) console.error(entry.stack);
        break;
      case LogLevel.FATAL:
        console.error('❌ FATAL ERROR:', fullMessage, entry.data);
        if (entry.stack) console.error(entry.stack);
        break;
    }
  }

  /**
   * Report log entry to external monitoring service
   */
  private reportToService(_entry: LogEntry): void {
    // In production, this would send to Sentry, DataDog, or similar
    if (!this.isDevelopment) {
      // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) })
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs from last N minutes
   */
  getRecentLogs(minutes: number = 10): LogEntry[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter(log => new Date(log.timestamp) > cutoff);
  }

  /**
   * Export logs for debugging
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    } else {
      // CSV format
      const headers = ['Timestamp', 'Level', 'Message', 'Context', 'Data'];
      const rows = this.logs.map(log => [
        log.timestamp,
        log.level,
        log.message,
        log.context || '',
        typeof log.data === 'object' ? JSON.stringify(log.data) : String(log.data)
      ]);
      return [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    }
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get statistics about logs
   */
  getStatistics() {
    const stats = {
      total: this.logs.length,
      byLevel: {
        DEBUG: 0,
        INFO: 0,
        WARN: 0,
        ERROR: 0,
        FATAL: 0
      },
      oldestLog: this.logs[0]?.timestamp || null,
      newestLog: this.logs[this.logs.length - 1]?.timestamp || null
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level]++;
    });

    return stats;
  }
}

// Export singleton instance
export default new LoggerService();
