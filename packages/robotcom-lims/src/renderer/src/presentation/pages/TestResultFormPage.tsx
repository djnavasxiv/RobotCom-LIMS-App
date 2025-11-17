import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CoagulationForm } from '../components/TestResults/CoagulationForm';
import { BloodTypeForm } from '../components/TestResults/BloodTypeForm';
import { ELISAForm } from '../components/TestResults/ELISAForm';
import { PregnancyForm } from '../components/TestResults/PregnancyForm';
import { UrinalysisForm } from '../components/TestResults/UrinalysisForm';
import { ChemistryForm } from '../components/TestResults/ChemistryForm';
import { ImmunologyForm } from '../components/TestResults/ImmunologyForm';
import { HormonesForm } from '../components/TestResults/HormonesForm';
import { StoolForm } from '../components/TestResults/StoolForm';

export const TestResultFormPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const testType = params.testType || '';
  const sampleId = params.sampleId;

  const renderForm = () => {
    switch (testType) {
      case 'coagulacion':
        return <CoagulationForm />;
      case 'grupo_sanguineo':
        return <BloodTypeForm />;
      case 'elisa':
        return <ELISAForm />;
      case 'embarazo':
        return <PregnancyForm />;
      case 'urinalisis':
        return <UrinalysisForm />;
      case 'quimica':
        return <ChemistryForm />;
      case 'inmunologia':
        return <ImmunologyForm />;
      case 'hormonas':
        return <HormonesForm />;
      case 'heces':
        return <StoolForm />;
      default:
        return (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/test-results')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 mb-4"
            >
              ← Volver
            </button>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Form for test type '{testType}' not found
            </div>
          </div>
        );
    }
  };

  return renderForm();
};
