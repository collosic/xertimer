import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';
import ExerciseLayout from '../components/ExerciseLayout';

// Xertimer context
import { CurrentWorkout } from '../store/Store';
import { AllWorkouts } from '../store/Store';

// Styles
const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

// Component
const Xertimer = () => {
  const currentWorkout = useContext(CurrentWorkout)
  const [isCreateSetFormOpen, setIsCreateSetFormOpen] = useState(false);
  const classes = useStyles();

  const openCreateSetForm = () => {
    currentWorkout.dispatch({ type: 'RESET_STATE' });
    setIsCreateSetFormOpen(true);
  };

  const closeCreateSetForm = () => {
    setIsCreateSetFormOpen(false);
  };

  const getView = () =>
    isCreateSetFormOpen ? (
      <ExerciseLayout onBack={closeCreateSetForm} />
    ) : (
      <XertimerMain
        onCreateSetClick={openCreateSetForm}
      />
    );

  return (
    <div className={classes.container}>
      <Layout />
      {getView()}
    </div>
  );
};

export default Xertimer;
