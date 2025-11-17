import {
  TestResultData,
  AllTestResults,
  SampleWithResults,
  TestEntryConfig,
} from '../../domain/types/TestResultsTypes';

export class TestResultsService {
  /**
   * Fetch a sample with its tests for entering results
   */
  static async getSampleWithTests(sampleId: string): Promise<SampleWithResults> {
    try {
      const result = await window.electronAPI!.dbQuery('sample', 'findUnique', {
        where: { id: sampleId },
        include: {
          patient: true,
          tests: {
            include: { test: true },
          },
          results: true,
        },
      });

      if (!result.success || !result.data) {
        throw new Error('Sample not found');
      }

      const data = result.data;
      return {
        id: data.id,
        sampleNumber: data.sampleNumber,
        patient: {
          id: data.patient.id,
          firstName: data.patient.firstName,
          lastName: data.patient.lastName,
          gender: data.patient.gender,
          birthDate: data.patient.birthDate,
        },
        tests: data.tests.map((st: any) => ({
          id: st.test.id,
          code: st.test.code,
          name: st.test.name,
          category: st.test.category || 'General',
        })),
        results: data.results || [],
      };
    } catch (error) {
      console.error('Error fetching sample with tests:', error);
      throw error;
    }
  }

  /**
   * Create or update a test result
   */
  static async saveTestResult(result: TestResultData): Promise<TestResultData> {
    try {
      const resultData = {
        sampleId: result.sampleId,
        testId: result.testId,
        value: String(result.value),
        isNormal: result.isNormal,
        notes: result.notes,
        enteredBy: result.enteredBy,
        enteredAt: new Date(),
      };

      if (result.id) {
        // Update existing
        const updateResult = await window.electronAPI!.dbQuery('result', 'update', {
          where: { id: result.id },
          data: resultData,
        });

        if (!updateResult.success) {
          throw new Error('Failed to update result');
        }

        return updateResult.data;
      } else {
        // Create new
        const createResult = await window.electronAPI!.dbQuery('result', 'create', {
          data: {
            ...resultData,
            id: undefined, // Let database generate
          },
        });

        if (!createResult.success) {
          throw new Error('Failed to create result');
        }

        return createResult.data;
      }
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }

  /**
   * Save multiple results at once
   */
  static async saveMultipleResults(results: TestResultData[]): Promise<void> {
    try {
      await Promise.all(results.map((result) => this.saveTestResult(result)));
    } catch (error) {
      console.error('Error saving multiple results:', error);
      throw error;
    }
  }

  /**
   * Mark sample as completed
   */
  static async markSampleComplete(sampleId: string): Promise<void> {
    try {
      const result = await window.electronAPI!.dbQuery('sample', 'update', {
        where: { id: sampleId },
        data: { status: 'completed' },
      });

      if (!result.success) {
        throw new Error('Failed to mark sample as complete');
      }
    } catch (error) {
      console.error('Error marking sample complete:', error);
      throw error;
    }
  }

  /**
   * Get sample status
   */
  static async getSampleStatus(sampleId: string): Promise<string> {
    try {
      const result = await window.electronAPI!.dbQuery('sample', 'findUnique', {
        where: { id: sampleId },
        select: { status: true },
      });

      if (!result.success || !result.data) {
        throw new Error('Sample not found');
      }

      return result.data.status;
    } catch (error) {
      console.error('Error getting sample status:', error);
      throw error;
    }
  }

  /**
   * Get all pending samples for results entry
   */
  static async getPendingSamples(): Promise<SampleWithResults[]> {
    try {
      const result = await window.electronAPI!.dbQuery('sample', 'findMany', {
        where: { status: 'pending' },
        include: {
          patient: true,
          tests: { include: { test: true } },
          results: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!result.success) {
        throw new Error('Failed to fetch pending samples');
      }

      return result.data.map((data: any) => ({
        id: data.id,
        sampleNumber: data.sampleNumber,
        patient: {
          id: data.patient.id,
          firstName: data.patient.firstName,
          lastName: data.patient.lastName,
          gender: data.patient.gender,
          birthDate: data.patient.birthDate,
        },
        tests: data.tests.map((st: any) => ({
          id: st.test.id,
          code: st.test.code,
          name: st.test.name,
          category: st.test.category || 'General',
        })),
        results: data.results || [],
      }));
    } catch (error) {
      console.error('Error fetching pending samples:', error);
      throw error;
    }
  }

  /**
   * Get test entry configuration
   */
  static getTestEntryConfig(testType: string): TestEntryConfig | null {
    const configs: Record<string, TestEntryConfig> = {
      coagulacion: {
        testType: 'coagulacion',
        displayName: 'Pruebas de Coagulación',
        category: 'Hematología',
        icon: '🩸',
        fields: [
          {
            name: 'protrombinaTime',
            label: 'Tiempo de Protrombina (PT)',
            type: 'number',
            units: 'segundos',
            min: 0,
            max: 100,
            step: 0.1,
            helpText: 'Rango normal: 11-13.5 segundos',
          },
          {
            name: 'INR',
            label: 'INR (Razón Normalizada Internacional)',
            type: 'number',
            min: 0,
            max: 10,
            step: 0.01,
            helpText: 'Rango normal: 0.8-1.1',
          },
          {
            name: 'fibrinogenLevel',
            label: 'Nivel de Fibrinógeno',
            type: 'number',
            units: 'mg/dL',
            min: 0,
            max: 500,
            step: 10,
            helpText: 'Rango normal: 200-400 mg/dL',
          },
          {
            name: 'thrombinTime',
            label: 'Tiempo de Trombina (TT)',
            type: 'number',
            units: 'segundos',
            min: 0,
            max: 100,
            step: 0.1,
            helpText: 'Rango normal: 14-16 segundos',
          },
          {
            name: 'activatedPartialThromboplastinTime',
            label: 'Tiempo de Tromboplastina Parcial Activado (aPTT)',
            type: 'number',
            units: 'segundos',
            min: 0,
            max: 100,
            step: 0.1,
            helpText: 'Rango normal: 25-35 segundos',
          },
          {
            name: 'notes',
            label: 'Notas Adicionales',
            type: 'textarea',
            placeholder: 'Observaciones o hallazgos relevantes',
          },
        ],
      },
      grupo_sanguineo: {
        testType: 'grupo_sanguineo',
        displayName: 'Grupo Sanguíneo',
        category: 'Serología',
        icon: '🩸',
        fields: [
          {
            name: 'bloodType',
            label: 'Tipo de Sangre',
            type: 'select',
            required: true,
            options: [
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
            ],
          },
          {
            name: 'rhFactor',
            label: 'Factor Rh',
            type: 'radio',
            required: true,
            options: [
              { value: '+', label: 'Positivo' },
              { value: '-', label: 'Negativo' },
            ],
          },
          {
            name: 'antiDPositive',
            label: 'Anti-D Positivo',
            type: 'checkbox',
          },
          {
            name: 'notes',
            label: 'Notas',
            type: 'textarea',
          },
        ],
      },
      elisa: {
        testType: 'elisa',
        displayName: 'ELISA',
        category: 'Inmunología',
        icon: '🧪',
        fields: [
          {
            name: 'testName',
            label: 'Tipo de Prueba ELISA',
            type: 'select',
            required: true,
            options: [
              { value: 'HIV', label: 'VIH' },
              { value: 'HBsAg', label: 'Antígeno de Superficie del VHB' },
              { value: 'HCV', label: 'Virus de la Hepatitis C' },
              { value: 'SYPHILIS', label: 'Sífilis' },
              { value: 'OTHER', label: 'Otro' },
            ],
          },
          {
            name: 'result',
            label: 'Resultado',
            type: 'radio',
            required: true,
            options: [
              { value: 'positive', label: 'Positivo' },
              { value: 'negative', label: 'Negativo' },
              { value: 'inconclusive', label: 'Inconcluso' },
            ],
          },
          {
            name: 'opticalDensity',
            label: 'Densidad Óptica (OD)',
            type: 'number',
            step: 0.001,
          },
          {
            name: 'cutoffValue',
            label: 'Valor de Corte',
            type: 'number',
            step: 0.001,
          },
          {
            name: 'interpretation',
            label: 'Interpretación',
            type: 'textarea',
          },
        ],
      },
      embarazo: {
        testType: 'embarazo',
        displayName: 'Prueba de Embarazo',
        category: 'Endocrinología',
        icon: '🤰',
        fields: [
          {
            name: 'testMethod',
            label: 'Método de Prueba',
            type: 'radio',
            required: true,
            options: [
              { value: 'blood', label: 'Sangre' },
              { value: 'urine', label: 'Orina' },
            ],
          },
          {
            name: 'result',
            label: 'Resultado',
            type: 'radio',
            required: true,
            options: [
              { value: 'positive', label: 'Positivo' },
              { value: 'negative', label: 'Negativo' },
            ],
          },
          {
            name: 'hCGLevel',
            label: 'Nivel de hCG',
            type: 'number',
            units: 'mIU/mL',
            min: 0,
            step: 0.1,
          },
          {
            name: 'weekEstimate',
            label: 'Semanas Estimadas',
            type: 'number',
            units: 'semanas',
            min: 0,
            max: 44,
          },
          {
            name: 'notes',
            label: 'Notas',
            type: 'textarea',
          },
        ],
      },
    };

    return configs[testType] || null;
  }

  /**
   * Get all results for a specific sample
   */
  static async getResultsBySampleId(sampleId: string): Promise<any[]> {
    try {
      const result = await window.electronAPI!.dbQuery('result', 'findMany', {
        where: { sampleId },
        include: {
          sample: {
            include: { patient: true },
          },
          test: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!result.success) {
        throw new Error('Failed to fetch results');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching results by sample ID:', error);
      throw error;
    }
  }
}

