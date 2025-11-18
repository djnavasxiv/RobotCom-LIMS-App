/**
 * PerformanceService - Application performance monitoring and metrics
 * Tracks render times, API latency, memory usage, and other metrics
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PerformanceStats {
  name: string;
  count: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  totalDuration: number;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();
  private maxMetrics = 500;
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Start timing a performance measurement
   */
  startMeasure(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * End timing and record measurement
   */
  endMeasure(
    label: string,
    metadata?: Record<string, any>
  ): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`Performance mark "${label}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    // Record metric
    const metric: PerformanceMetric = {
      name: label,
      duration,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow operations
    if (this.isDevelopment && duration > 100) {
      console.warn(
        `⚠️ Slow operation: "${label}" took ${duration.toFixed(2)}ms`,
        metadata
      );
    }

    return duration;
  }

  /**
   * Measure function execution time
   */
  async measureAsync<T>(
    label: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMeasure(label);
    try {
      return await fn();
    } finally {
      this.endMeasure(label, metadata);
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(
    label: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.startMeasure(label);
    try {
      return fn();
    } finally {
      this.endMeasure(label, metadata);
    }
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics for specific operation
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get performance statistics
   */
  getStatistics(name?: string): PerformanceStats[] {
    const groups = new Map<string, PerformanceMetric[]>();

    const relevantMetrics = name
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;

    relevantMetrics.forEach(metric => {
      if (!groups.has(metric.name)) {
        groups.set(metric.name, []);
      }
      groups.get(metric.name)!.push(metric);
    });

    return Array.from(groups.entries()).map(([metricName, metricsList]) => {
      const durations = metricsList.map(m => m.duration);
      const totalDuration = durations.reduce((a, b) => a + b, 0);

      return {
        name: metricName,
        count: metricsList.length,
        averageDuration: totalDuration / metricsList.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        totalDuration
      };
    });
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  } | null {
    if ((performance as any).memory) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Get page load performance metrics
   */
  getPageLoadMetrics(): {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
  } | null {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    const paint = performance.getEntriesByType('paint');
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const stats = this.getStatistics();
    const memory = this.getMemoryUsage();
    const pageLoad = this.getPageLoadMetrics();

    let report = '📊 Performance Report\n';
    report += '='.repeat(50) + '\n\n';

    report += 'Operation Performance:\n';
    report += '-'.repeat(50) + '\n';
    stats.forEach(stat => {
      report += `${stat.name}:\n`;
      report += `  Count: ${stat.count}\n`;
      report += `  Avg: ${stat.averageDuration.toFixed(2)}ms\n`;
      report += `  Min: ${stat.minDuration.toFixed(2)}ms\n`;
      report += `  Max: ${stat.maxDuration.toFixed(2)}ms\n`;
      report += `  Total: ${stat.totalDuration.toFixed(2)}ms\n\n`;
    });

    if (memory) {
      report += 'Memory Usage:\n';
      report += '-'.repeat(50) + '\n';
      report += `Used: ${(memory.usedJSHeapSize! / 1024 / 1024).toFixed(2)} MB\n`;
      report += `Total: ${(memory.totalJSHeapSize! / 1024 / 1024).toFixed(2)} MB\n`;
      report += `Limit: ${(memory.jsHeapSizeLimit! / 1024 / 1024).toFixed(2)} MB\n\n`;
    }

    if (pageLoad) {
      report += 'Page Load Performance:\n';
      report += '-'.repeat(50) + '\n';
      report += `DOM Content Loaded: ${pageLoad.domContentLoaded.toFixed(2)}ms\n`;
      report += `Load Complete: ${pageLoad.loadComplete.toFixed(2)}ms\n`;
      if (pageLoad.firstPaint) {
        report += `First Paint: ${pageLoad.firstPaint.toFixed(2)}ms\n`;
      }
      if (pageLoad.firstContentfulPaint) {
        report += `First Contentful Paint: ${pageLoad.firstContentfulPaint.toFixed(2)}ms\n`;
      }
    }

    return report;
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.marks.clear();
  }

  /**
   * Check for performance issues and return recommendations
   */
  analyzePerformance(): string[] {
    const recommendations: string[] = [];
    const stats = this.getStatistics();

    stats.forEach(stat => {
      if (stat.averageDuration > 100) {
        recommendations.push(
          `⚠️ "${stat.name}" is slow (avg ${stat.averageDuration.toFixed(0)}ms). Consider optimization.`
        );
      }
      if (stat.maxDuration > 500) {
        recommendations.push(
          `❌ "${stat.name}" has very slow execution (max ${stat.maxDuration.toFixed(0)}ms).`
        );
      }
    });

    const memory = this.getMemoryUsage();
    if (memory && memory.usedJSHeapSize! > memory.jsHeapSizeLimit! * 0.8) {
      recommendations.push(
        '⚠️ Memory usage is high. Consider clearing old metrics or optimizing memory usage.'
      );
    }

    return recommendations.length > 0
      ? recommendations
      : ['✅ Performance looks good!'];
  }
}

// Export singleton instance
export default new PerformanceService();
