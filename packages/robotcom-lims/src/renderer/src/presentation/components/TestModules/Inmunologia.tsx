import React from 'react';
import SimpleTestForm from './SimpleTestForm';

const Inmunologia: React.FC = () => {
  const agglutinationFields = [
    'TIFICO "O"',
    'TIFICO "H"',
    'PARATIFICO "A"',
    'PARATIFICO "B"',
    'BRUCELLA ABORTUS',
    'PROTEUS OX-19',
  ];

  return (
    <SimpleTestForm
      title="INMUNOLOGÍA"
      showMuestra={true}
      agglutinationFields={agglutinationFields}
      hasCardButton={true}
    />
  );
};

export default Inmunologia;
