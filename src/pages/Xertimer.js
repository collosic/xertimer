import React, { useState, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';
import ExerciseLayout from '../components/ExerciseLayout';

// Xertimer context
import { CurrentWorkoutProvider } from '../store/Store';
import { AllWorkoutsProvider } from '../store/Store';

// Styles
const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

// Initial States
const initNewWorkout = [];

const initAllWorkouts = {
  sets: [],
};

const newWorkoutReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return initNewWorkout;
    case 'ADD':
      return [...state, action.value];
    case 'DELETE':
      return [...state];
    case 'ADJUST':
      return [...action.value];
    default:
      break;
  }
};

const allWorkoutsReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return { ...initAllWorkouts };
    case 'OVERRIDE':
      return { ...action.value };
    default:
      break;
  }
};

// Component
const Xertimer = () => {
  const [newWorkout, newWorkoutDispatch] = useReducer(
    newWorkoutReducer,
    initNewWorkout,
  );
  const [allWorkouts, allWorkoutsDispatch] = useReducer(
    allWorkoutsReducer,
    initAllWorkouts,
  );
  const [isCreateSetFormOpen, setIsCreateSetFormOpen] = useState(false);
  const classes = useStyles();

  const openCreateSetForm = () => {
    newWorkoutDispatch({ type: 'RESET_STATE' });
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
        workouts={newWorkout}
      />
    );

  return (
    <AllWorkoutsProvider>
      <CurrentWorkoutProvider>
        <div className={classes.container}>
          <Layout />
          {getView()}
        </div>
      </CurrentWorkoutProvider>
    </AllWorkoutsProvider>
  );
};

export default Xertimer;
