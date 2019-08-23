import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';
import ExerciseLayout from '../components/ExerciseLayout';
import CustomSnackBar from '../components/CustomSnackBar';

// Xertimer context
import { CurrentWorkout } from '../store/Store';

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
  console.log('Xertimer');
  const [isExerciseLayoutOpen, setIsExerciseLayoutOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [editWorkout, setEditWorkout] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);
  const classes = useStyles();

  // Global States
  const currentWorkout = useContext(CurrentWorkout);

  const openCreateWorkout = () => {
    currentWorkout.dispatch({ type: 'RESET_STATE' });
    setIsExerciseLayoutOpen(true);
  };

  const openEditWorkout = id => {
    setWorkoutId(id);
    setIsExerciseLayoutOpen(true);
    setEditWorkout(true);
  };

  const closeExerciseLayout = () => {
    setIsExerciseLayoutOpen(false);
    setEditWorkout(false);
  };

  const getView = () =>
    isExerciseLayoutOpen ? (
      <ExerciseLayout
        workoutId={workoutId}
        editingExistingWorkout={editWorkout}
        onBack={closeExerciseLayout}
        setSnackBarMsg={setSnackBarMsg}
        openSnackBar={() => setOpenSnackBar(true)}
      />
    ) : (
      <XertimerMain
        onEditWorkoutClick={openEditWorkout}
        onCreateSetClick={openCreateWorkout}
        setSnackBarMsg={setSnackBarMsg}
        openSnackBar={() => setOpenSnackBar(true)}
      />
    );

  return (
    <div className={classes.container}>
      <Layout />
      {getView()}
      {openSnackBar && (
        <CustomSnackBar
          message={snackBarMsg}
          onClose={() => setOpenSnackBar(false)}
        />
      )}
    </div>
  );
};

export default Xertimer;
