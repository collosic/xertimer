import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { typeAnnotation } from '@babel/types';
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
  const [isCreateSetFormOpen, setIsCreateSetFormOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const classes = useStyles();

  const openCreateSetForm = () => {
    setIsCreateSetFormOpen(true);
  };

  const closeCreateSetForm = (set) => {
    const totalWorkouts = [...allWorkouts];
    totalWorkouts.push(newWorkout);
    setAllWorkouts(totalWorkouts);
    setIsCreateSetFormOpen(false);
  };

  const addNewWorkout = (sets) => {
    setNewWorkout({ ...sets });
  };

  const getView = () => (isCreateSetFormOpen ? (
    <CreateSetForm onClose={closeCreateSetForm} updateState={addNewWorkout} />
  ) : (
    <XertimerMain onCreateSetClick={openCreateSetForm} workouts={allWorkouts} />
  ));

  return (
    <div className={classes.container}>
      <Layout />
      {getView()}
    </div>
  );
};

export default Xertimer;
