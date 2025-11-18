import React from 'react';
import SimpleTestForm from './SimpleTestForm';

const Hormonas: React.FC = () => {
  return (
    <SimpleTestForm
      title="HORMONAS Y MARCADORES TUMORALES"
      showMuestra={true}
      agglutinationFields={[]}
    />
  );
};

export default Hormonas;
