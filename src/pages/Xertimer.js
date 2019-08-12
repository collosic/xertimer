import React, { useState, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';
import CreateSetForm from '../components/CreateSetForm';

// Xertimer context
export const NewWorkoutContext = React.createContext();

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
    case 'add':
      return [...state, action.value];
    default:
      break;
  }
};

const allWorkoutsReducer = (state, action) => {
  switch (action.type) {
    case 'resetAllWorkoutsState':
      return { ...initAllWorkouts };
    case 'addWorkout':
      return { ...state };
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
    setIsCreateSetFormOpen(true);
  };

  const closeCreateSetForm = () => {
    setIsCreateSetFormOpen(false);
  };

  const getView = () =>
    isCreateSetFormOpen ? (
      <CreateSetForm onClose={closeCreateSetForm} />
    ) : (
      <XertimerMain
        onCreateSetClick={openCreateSetForm}
        workouts={newWorkout}
      />
    );

  return (
    <NewWorkoutContext.Provider
      value={{ state: newWorkout, dispatch: newWorkoutDispatch }}
    >
      <div className={classes.container}>
        <Layout />
        {getView()}
      </div>
    </NewWorkoutContext.Provider>
  );
};

export default Xertimer;
