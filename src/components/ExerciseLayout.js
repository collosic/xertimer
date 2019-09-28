import React, { useState, useEffect, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, InputBase, Hidden, Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import uuid from 'uuid';

import ExerciseList from './ExerciseList';
import CreateSetDialog from '../dialogs/CreateSetDialog';
import CustomSnackBar from './CustomSnackBar';
import Spinner from './Spinner';

// Dialogs
import BackButtonDialog from '../dialogs/BackButtonDialog';

// Firebase Class
import firebase from './Firebase';

// Contexts
import { CurrentWorkout, AllWorkouts } from '../store/Store';

// Styles
const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: '1',
  },
  containerContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  layout: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      height: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    height: '100%',
    marginTop: 0,
    marginBottom: 0,
    padding: theme.spacing(2),
    paddingBottom: 64,
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      height: '100%',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  subHeader: {
    display: 'flex',
  },
  subHeaderText: {
    fontSize: 24,
    textAlign: 'center',
    padding: theme.spacing(0),
    flex: '1 1 auto',
  },
  divider: {
    margin: 10,
    backgroundColor: theme.palette.primary.main,
  },
  subMenu: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0px 15px',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const ExerciseLayout = ({
  editingExistingWorkout,
  workoutId,
  onBack,
  setLoadWorkouts,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBackButtonDialogOpen, setIsBackButtonDialogOpen] = useState(false);
  const [editModeOn, setEditModeOn] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [id, setId] = useState(null);
  const [totalTime, setTotalTime] = useState({ min: 0, sec: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [existingWorkout, setExistingWorkout] = useState(null);

  // Global States
  const currentWorkout = useContext(CurrentWorkout);
  const allWorkouts = useContext(AllWorkouts);

  // Helper Functions
  const generateNewWorkoutObj = () => {
    return {
      numberOfCycles: 0,
      numberOfSets: currentWorkout.state.sets.filter(set => set.type !== 'REST')
        .length,
      sets: [...currentWorkout.state.sets],
      timerLength: { ...totalTime },
      title: workoutTitle,
    };
  };

  const generateUpdatedWorkoutObj = () => {
    const modifiedWorkoutObj = generateNewWorkoutObj();
    let returnObj = {};
    if (modifiedWorkoutObj.title !== existingWorkout.title) {
      returnObj.title = modifiedWorkoutObj.title;
    }

    if (modifiedWorkoutObj.numberOfCycles !== existingWorkout.numberOfCycles) {
      returnObj.numberOfCycles = modifiedWorkoutObj.numberOfCycles;
    }

    if (modifiedWorkoutObj.numberOfSets !== existingWorkout.numberOfSets) {
      returnObj.numberOfSets = modifiedWorkoutObj.numberOfSets;
    }

    if (
      JSON.stringify(modifiedWorkoutObj.timerLength) !==
      JSON.stringify(existingWorkout.timerLength)
    ) {
      returnObj.timerLength = { ...modifiedWorkoutObj.timerLength };
    }

    if (
      JSON.stringify(modifiedWorkoutObj.sets) !==
      JSON.stringify(existingWorkout.sets)
    ) {
      returnObj.sets = [...modifiedWorkoutObj.sets];
    }

    return returnObj;
  };

  const hasExistingWorkoutBeenModified = () => {
    // Check and see if the workout has been modified
    return (
      JSON.stringify(generateNewWorkoutObj()) !==
      JSON.stringify(existingWorkout)
    );
  };

  const setTotalTimeFunc = useCallback(() => {
    // Extract the total minutes and seconds from the Workout Context
    const totalMin = currentWorkout.state.sets.reduce(
      (total, set) => total + set.minutes,
      0,
    );
    const totalSec = currentWorkout.state.sets.reduce(
      (total, set) => total + set.seconds,
      0,
    );
    // Convert seconds into minutes leaving the remainder seconds as is
    const adjustedMin = totalMin + Math.floor((totalSec % 3600) / 60);
    const adjustedSec = Math.floor((totalSec % 3600) % 60);
    setTotalTime({ min: adjustedMin, sec: adjustedSec });
  }, [currentWorkout.state.sets]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditModeOn(false);
    setTotalTimeFunc();
  };

  const handleEdit = useCallback(uid => {
    setIsDialogOpen(true);
    setEditModeOn(true);
    setId(uid);
  }, []);

  const handleBackArrowButton = () => {
    if (
      (!editingExistingWorkout && currentWorkout.state.sets.length > 0) ||
      (editingExistingWorkout && hasExistingWorkoutBeenModified())
    ) {
      setIsBackButtonDialogOpen(true);
    } else {
      onBack();
    }
  };

  const handleChange = e => {
    setWorkoutTitle(e.target.value);
  };

  const handleSave = async () => {
    // Check to see if user added name for the workout
    if (workoutTitle === '') {
      setSnackBarMsg('Must provide a title for the workout');
      setOpenSnackBar(true);
      return null;
    }

    if (currentWorkout.state.sets.length === 0) {
      setSnackBarMsg('Must add at least one exercise');
      setOpenSnackBar(true);
      return null;
    }

    setIsSaving(true);
    // Determine if adding new workout or updating
    if (editingExistingWorkout) {
      if (!hasExistingWorkoutBeenModified()) {
        setSnackBarMsg("You haven't made any changes");
        setOpenSnackBar(true);
        setIsSaving(false);
        return null;
      }
    }
    const method = editingExistingWorkout ? 'updateWorkout' : 'addWorkout';
    const workoutToBeSaved = editingExistingWorkout
      ? generateUpdatedWorkoutObj()
      : generateNewWorkoutObj();
    // Determine if user is guest or firebase user
    if (!firebase.isGuest) {
      // Save workout to Firestore
      try {
        await firebase[method](workoutToBeSaved, workoutId);
        setSnackBarMsg(
          `Successfully ${
            editingExistingWorkout ? 'updated' : 'saved'
          } workout`,
        );
        setLoadWorkouts('LOAD_WORKOUTS');
      } catch (e) {
        setSnackBarMsg('Something went wrong with the save');
        console.log(e);
      }
    } else {
      const workouts = JSON.parse(sessionStorage.getItem('ALL_WORKOUTS'));
      if (editingExistingWorkout) {
        workouts.find(workout => {
          if (workout.id === workoutId) {
            Object.entries(workoutToBeSaved).forEach(([key, value]) => {
              workout.workout[key] = workoutToBeSaved[key];
            });
          }
        });
      } else {
        workouts.push({ id: uuid.v4(), workout: workoutToBeSaved });
      }

      sessionStorage.setItem('ALL_WORKOUTS', JSON.stringify(workouts));
      setSnackBarMsg(
        `Successfully ${editingExistingWorkout ? 'updated' : 'saved'} workout`,
      );
      setLoadWorkouts('LOAD_WORKOUTS');
    }
    setIsSaving(false);
    setOpenSnackBar(true);
    onBack();
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const classes = useStyles();

  useEffect(() => {
    setTotalTimeFunc();
  }, [setTotalTimeFunc]);

  useEffect(() => {
    if (editingExistingWorkout) {
      const extractedWorkout = allWorkouts.state.find(
        workout => workout.id === workoutId,
      );
      currentWorkout.dispatch({
        type: 'OVERRIDE',
        value: extractedWorkout.workout.sets,
      });
      setExistingWorkout({ ...extractedWorkout.workout });
      setTotalTime(extractedWorkout.workout.timerLength);
      setWorkoutTitle(extractedWorkout.workout.title);
    }
  }, []);

  return (
    <div className={classes.container}>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <div className={classes.subHeader}>
            <Tooltip title='Back' enterDelay={400}>
              <IconButton onClick={() => handleBackArrowButton()}>
                <Icon>arrow_back</Icon>
              </IconButton>
            </Tooltip>
            <InputBase
              className={classes.subHeaderText}
              autoFocus
              placeholder='e.g. Leg Day'
              value={workoutTitle}
              onChange={handleChange}
              inputProps={{
                'aria-label': 'workout title',
                style: { textAlign: 'center' },
              }}
            />
            <Tooltip title='Save' enterDelay={400}>
              <IconButton onClick={() => handleSave()} color='primary'>
                <Icon>save_alt</Icon>
              </IconButton>
            </Tooltip>
          </div>
          <Divider className={classes.divider} variant='fullWidth' />
          <div className={classes.subMenu}>
            <Typography color='textSecondary'>
              {`Total Time: ${totalTime.min < 10 ? '0' : ''}${totalTime.min}:${
                totalTime.sec < 10 ? '0' : ''
              }${totalTime.sec}`}
            </Typography>
            <Typography color='textSecondary'>Number of Cycles: 0</Typography>
          </div>

          <ExerciseList onEdit={handleEdit} />
        </Paper>
      </main>
      <Tooltip title='Add' enterDelay={400}>
        <Fab
          color='primary'
          aria-label='add'
          className={classes.fab}
          onClick={() => setIsDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      {isDialogOpen && (
        <>
          <Hidden only='xs'>
            <CreateSetDialog
              handleClose={handleCloseDialog}
              isEditModeOn={editModeOn}
              id={id}
            />
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <CreateSetDialog
              fullScreen
              handleClose={handleCloseDialog}
              isEditModeOn={editModeOn}
              id={id}
            />
          </Hidden>
        </>
      )}
      {isBackButtonDialogOpen && (
        <BackButtonDialog
          open={isBackButtonDialogOpen}
          stay={() => setIsBackButtonDialogOpen(false)}
          goBack={() => {
            setIsBackButtonDialogOpen(false);
            onBack();
          }}
        />
      )}
      {openSnackBar && (
        <CustomSnackBar message={snackBarMsg} onClose={handleCloseSnackBar} />
      )}
      {isSaving && <Spinner />}
    </div>
  );
};

export default React.memo(ExerciseLayout);
