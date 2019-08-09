import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';
import CreateSetForm from '../components/CreateSetForm';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Xertimer = () => {
  const [isCreateSetFormOpen, setIsCreateSetFormOpen] = useState(true);
  const classes = useStyles();

  const openCreateSetForm = () => {
    setIsCreateSetFormOpen(true);
  };

  const closeCreateSetForm = () => {
    setIsCreateSetFormOpen(false);
  };

  const getView = () => (isCreateSetFormOpen ? (
    <CreateSetForm onClose={closeCreateSetForm} />
  ) : (
    <XertimerMain onCreateSetClick={openCreateSetForm} />
  ));

  return (
    <div className={classes.container}>
      <Layout />
      {getView()}
    </div>
  );
};

export default Xertimer;
