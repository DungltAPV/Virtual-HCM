import React from 'react';
import { useToasts } from 'react-toast-notifications';
import { DashBoard } from 'src/modules/contributor';

const Contributor = () => {
  const { addToast } = useToasts();
  return <DashBoard addToast={addToast} />;
};

export default Contributor;
