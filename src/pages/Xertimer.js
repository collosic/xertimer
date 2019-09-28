import React, { useReducer, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';
import ExerciseLayout from '../components/ExerciseLayout';
import StartWorkout from '../components/StartWorkout';

import CustomSnackBar from '../components/CustomSnackBar';
import firebase from '../components/Firebase';

// Xertimer context
import { CurrentWorkout, AllWorkouts } from '../store/Store';

// Styles
const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

// Init state
const initState = {
  currentView: 'MAIN',
  editingWorkout: false,
  workoutId: null,
  openSnackBar: false,
  snackBarMsg: '',
  loadWorkouts: true,
};

// Reducers
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_EXERCISE_LAYOUT':
      return { ...state, currentView: 'EXERCISE_LAYOUT' };
    case 'SET_EDITING_WORKOUT':
      return { ...state, editingWorkout: action.value };
    case 'SET_WORKOUT_ID':
      return { ...state, workoutId: action.value };
    case 'SET_OPEN_SNACKBAR':
      return { ...state, openSnackBar: action.value };
    case 'SET_SNACKBAR_MSG':
      return { ...state, snackBarMsg: action.value };

    case 'OPEN_MAIN':
      return { ...state, currentView: 'MAIN', editingWorkout: false };
    case 'OPEN_EDIT_WORKOUT':
      return {
        ...state,
        currentView: 'EXERCISE_LAYOUT',
        workoutId: action.value,
        editingWorkout: true,
      };
    case 'OPEN_START_WORKOUT':
      return {
        ...state,
        currentView: 'START_WORKOUT',
        workoutId: action.value,
      };
    case 'DO_NOT_LOAD_WORKOUTS':
      return { ...state, loadWorkouts: false };
    case 'LOAD_WORKOUTS':
      return { ...state, loadWorkouts: true };
    default:
      return { ...state };
  }
};

// Component
const Xertimer = props => {
  const [state, dispatch] = useReducer(stateReducer, initState);
  const classes = useStyles();

  // Global States
  const currentWorkout = useContext(CurrentWorkout);
  const allWorkouts = useContext(AllWorkouts);

  const openCreateWorkout = () => {
    currentWorkout.dispatch({ type: 'RESET_STATE' });
    dispatch({ type: 'OPEN_EXERCISE_LAYOUT' });
  };

  const openEditWorkout = id => {
    dispatch({ type: 'OPEN_EDIT_WORKOUT', value: id });
  };

  const openMain = () => {
    dispatch({ type: 'OPEN_MAIN' });
  };

  const openStartTimer = id => {
    const extractedWorkout = allWorkouts.state.find(
      workout => workout.id === id,
    );
    currentWorkout.dispatch({
      type: 'OVERRIDE',
      value: extractedWorkout.workout.sets,
    });
    dispatch({ type: 'OPEN_START_WORKOUT', value: id });
  };

  const getView = () => {
    switch (state.currentView) {
      case 'MAIN':
        return (
          <XertimerMain
            onEditWorkoutClick={openEditWorkout}
            onCreateSetClick={openCreateWorkout}
            loadWorkouts={state.loadWorkouts}
            setLoadWorkouts={type => dispatch({ type })}
            startTimer={openStartTimer}
            setSnackBarMsg={msg =>
              dispatch({ type: 'SET_SNACKBAR_MSG', value: msg })
            }
            openSnackBar={() =>
              dispatch({ type: 'SET_OPEN_SNACKBAR', value: true })
            }
          />
        );
      case 'EXERCISE_LAYOUT':
        return (
          <ExerciseLayout
            workoutId={state.workoutId}
            editingExistingWorkout={state.editingWorkout}
            onBack={openMain}
            setLoadWorkouts={type => dispatch({ type })}
            setSnackBarMsg={msg =>
              dispatch({ type: 'SET_SNACKBAR_MSG', value: msg })
            }
            openSnackBar={() =>
              dispatch({ type: 'SET_OPEN_SNACKBAR', value: true })
            }
          />
        );
      case 'START_WORKOUT':
        return <StartWorkout goBack={openMain} />;
      default:
        return '';
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await firebase.getCurrentUser();
      if (!firebase.isGuest && !user) {
        props.history.replace('/');
      }
    };
    getUser();
  }, [props.history]);

  return (
    <div className={classes.container}>
      <Layout isSignedIn />
      {getView()}
      {state.openSnackBar && (
        <CustomSnackBar
          message={state.snackBarMsg}
          onClose={() => dispatch({ type: 'SET_OPEN_SNACKBAR', value: true })}
        />
      )}
    </div>
  );
};

export default withRouter(Xertimer);
