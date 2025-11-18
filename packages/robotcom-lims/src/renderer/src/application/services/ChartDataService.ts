import { PrismaClient } from '@prisma/client';
import { TrendData } from '../../presentation/components/Charts/TrendChart';
import { DistributionData } from '../../presentation/components/Charts/DistributionChart';
import { ComparisonData } from '../../presentation/components/Charts/ResultsComparisonChart';

const prisma = new PrismaClient();

export class ChartDataService {
  /**
   * Get trend data for test results over time
   * Returns last 30 days of results grouped by date
   */
  async getResultsTrendData(_labId: string, limit: number = 30): Promise<TrendData[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - limit);

      const results = await prisma.result.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        include: {
          test: true,
          sample: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const trendData: TrendData[] = results.map(result => ({
        date: new Date(result.createdAt).toLocaleDateString('es-CO'),
        value: typeof result.value === 'string' ? parseFloat(result.value) || 0 : (result.value as number),
        testName: result.test?.name || 'Unknown',
      }));

      return trendData;
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return [];
    }
  }

  /**
   * Get distribution data showing test type breakdown
   */
  async getTestDistributionData(_labId: string): Promise<DistributionData[]> {
    try {
      const testCounts = await prisma.result.groupBy({
        by: ['testId'],
        _count: true,
      });

      const distributionData: DistributionData[] = [];

      for (const count of testCounts) {
        const test = await prisma.test.findUnique({
          where: { id: count.testId },
        });

        if (test) {
          distributionData.push({
            name: test.name,
            value: count._count,
          });
        }
      }

      return distributionData.sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error('Error fetching distribution data:', error);
      return [];
    }
  }

  /**
   * Get results comparison data (normal vs abnormal)
   */
  async getResultsComparisonData(_labId: string): Promise<ComparisonData[]> {
    try {
      const results = await prisma.result.findMany({
        include: {
          test: true,
        },
      });

      // Group by test and count normal/abnormal
      const comparisonMap = new Map<string, { normal: number; abnormal: number }>();

      for (const result of results) {
        const testName = result.test?.name || 'Unknown';
        const existing = comparisonMap.get(testName) || { normal: 0, abnormal: 0 };

        if (result.isNormal) {
          existing.normal++;
        } else {
          existing.abnormal++;
        }

        comparisonMap.set(testName, existing);
      }

      return Array.from(comparisonMap.entries())
        .map(([name, data]) => ({
          name,
          ...data,
        }))
        .sort((a, b) => (b.normal + b.abnormal) - (a.normal + a.abnormal));
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      return [];
    }
  }

  /**
   * Get sample processing statistics
   */
  async getSampleStatistics(_labId: string) {
    try {
      const samples = await prisma.sample.findMany({
        include: {
          tests: true,
          results: true,
        },
      });

      const stats = {
        total: samples.length,
        pending: samples.filter(s => s.status === 'pending').length,
        processing: samples.filter(s => s.status === 'processing').length,
        completed: samples.filter(s => s.status === 'completed').length,
        withResults: samples.filter(s => s.results.length > 0).length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching sample statistics:', error);
      return { total: 0, pending: 0, processing: 0, completed: 0, withResults: 0 };
    }
  }

  /**
   * Filter trend data by date range
   */
  filterTrendByDateRange(data: TrendData[], startDate?: string, endDate?: string): TrendData[] {
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      const itemDate = new Date(item.date).getTime();
      const isAfterStart = !startDate || itemDate >= new Date(startDate).getTime();
      const isBeforeEnd = !endDate || itemDate <= new Date(endDate).getTime();
      return isAfterStart && isBeforeEnd;
    });
  }

  /**
   * Filter trend data by test type
   */
  filterTrendByTestType(data: TrendData[], testType?: string): TrendData[] {
    if (!testType || testType === 'all') return data;
    return data.filter(item => item.testName.toLowerCase().includes(testType.toLowerCase()));
  }

  /**
   * Filter distribution data by test type
   */
  filterDistributionByTestType(data: DistributionData[], testType?: string): DistributionData[] {
    if (!testType || testType === 'all') return data;
    return data.filter(item => item.name.toLowerCase().includes(testType.toLowerCase()));
  }

  /**
   * Filter comparison data by test type and result status
   */
  filterComparisonByType(data: ComparisonData[], testType?: string): ComparisonData[] {
    if (!testType || testType === 'all') return data;
    return data.filter(item => item.name.toLowerCase().includes(testType.toLowerCase()));
  }

  /**
   * Filter comparison data by result status (normal/abnormal)
   */
  filterComparisonByStatus(
    data: ComparisonData[],
    status: 'all' | 'normal' | 'abnormal'
  ): ComparisonData[] {
    if (status === 'all') return data;

    return data.map(item => {
      if (status === 'normal') {
        return { ...item, abnormal: 0 };
      } else {
        return { ...item, normal: 0 };
      }
    });
  }

  /**
   * Apply multiple filters to trend data
   */
  applyTrendFilters(
    data: TrendData[],
    startDate?: string,
    endDate?: string,
    testType?: string
  ): TrendData[] {
    let filtered = data;
    filtered = this.filterTrendByDateRange(filtered, startDate, endDate);
    filtered = this.filterTrendByTestType(filtered, testType);
    return filtered;
  }

  /**
   * Apply multiple filters to comparison data
   */
  applyComparisonFilters(
    data: ComparisonData[],
    testType?: string,
    status?: 'all' | 'normal' | 'abnormal'
  ): ComparisonData[] {
    let filtered = data;
    filtered = this.filterComparisonByType(filtered, testType);
    if (status) {
      filtered = this.filterComparisonByStatus(filtered, status);
    }
    return filtered;
  }
}

export default new ChartDataService();
