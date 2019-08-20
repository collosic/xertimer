import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  InputBase,
  Hidden,
  Typography,
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ExerciseList from './ExerciseList';
import CreateSetDialog from '../dialogs/CreateSetDialog';
import CustomSnackBar from './CustomSnackBar';
import Spinner from './Spinner';

// Dialogs
import BackButtonDialog from '../dialogs/BackButtonDialog'

// Firebase Class
import firebase from './Firebase';

// Contexts
import { CurrentWorkout, AllWorkouts } from '../store/Store';
import { LocalConvenienceStoreOutlined } from '@material-ui/icons';


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
      height: '90%',
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

const ExerciseLayout = ({ onBack }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBackButtonDialogOpen, setIsBackButtonDialogOpen] = useState(false);
  const [editModeOn, setEditModeOn] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [errors, setErrors] = useState(null);
  const [id, setId] = useState(null);
  const [totalTime, setTotalTime] = useState({min: 0, sec: 0})
  const [isSaving, setIsSaving] = useState(false);

  // Global States
  const currentWorkoutContext = useContext(CurrentWorkout);
  const allWorkouts = useContext(AllWorkouts);

  const generateWorkoutObj = () => {
    return {
      title: workoutName,
      allSets: [...currentWorkoutContext.state],
      numberOfSets: currentWorkoutContext.state.filter(set => set.type !== 'REST').length,
      timerLength: { ...totalTime },
      numberOfCycles: 0,
    }
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditModeOn(false);
  };

  const handleEdit = (id) => {
    setIsDialogOpen(true);
    setEditModeOn(true);
    setId(id);
  }

  const handleBack = () => {
    if (currentWorkoutContext.state.length > 0) {
      setIsBackButtonDialogOpen(true);
    } else {
      onBack();
    }
  }

  const handleChange = (e) => {
    setWorkoutName(e.target.value);
  }

  const handleSave = async () => {
    // Check to see if user added name for the workout
    if (workoutName === '') {
      setErrors({ message: 'Must provide a title for the workout' });
      setOpenSnackBar(true);
    } else if (currentWorkoutContext.state.length === 0) {
      setErrors({ message: 'Must add at least one exercise' });
      setOpenSnackBar(true);
    } else {
      setIsSaving(true);
      const completeWorkout = generateWorkoutObj();
      
      // Save workout to Firestore
      try {
        await firebase.addNewWorkout(completeWorkout);
        // clear currentWorkoutContext
        
      } catch(e) {
        console.log(e);
      }   
      setIsSaving(false);
      onBack();
    }
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const classes = useStyles();

  useEffect(() => {
    console.log('Component Did Mount')
    const setTotalTimeFunc = () => {
      // Extract the total minutes and seconds from the Workout Context
      const totalMin = currentWorkoutContext.state.reduce((total, set) => total + set.minutes, 0);
      const totalSec = currentWorkoutContext.state.reduce((total, set) => total + set.seconds, 0);
      // Convert seconds into minutes leaving the remainder seconds as is
      const adjustedMin = totalMin + Math.floor(totalSec % 3600 / 60);
      const adjustedSec = Math.floor(totalSec % 3600 % 60);
      setTotalTime({min: adjustedMin, sec: adjustedSec})
    }

    setTotalTimeFunc();
  }, [currentWorkoutContext])

  return (
    <div className={classes.container}>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <div className={classes.subHeader}>
            <Tooltip title='Back'>
              <IconButton onClick={() => handleBack()}>
                <Icon>arrow_back</Icon>
              </IconButton>
            </Tooltip>
            <InputBase
              className={classes.subHeaderText}
              autoFocus
              error={!!(errors && errors.workoutName)}
              placeholder='e.g. Leg Day'
              value={workoutName}
              onChange={handleChange}
              inputProps={{
                'aria-label': 'workout title',
                style: { textAlign: 'center' },
              }}
            />
            <Tooltip title='Save'>
              <IconButton onClick={() => handleSave()} color='primary'>
                <Icon>save_alt</Icon>
              </IconButton>
            </Tooltip>
          </div>
          <Divider className={classes.divider} variant='fullWidth' />
          <div className={classes.subMenu}>
            <Typography color='textSecondary'>
              {`Total Time: ${totalTime.min < 10 ? '0' : ''}${totalTime.min}:${totalTime.sec < 10 ? '0' : ''}${totalTime.sec}`}
            </Typography>
            <Typography color='textSecondary'>
              Number of Cycles: 0
            </Typography>
          </div>

          <ExerciseList onEdit={handleEdit} />
        </Paper>
      </main>
      <Tooltip title='Add'>
        <Fab
          color='primary'
          aria-label='add'
          className={classes.fab}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      {isDialogOpen && (
        <>
          <Hidden only='xs'>
            <CreateSetDialog handleClose={handleCloseDialog} isEditModeOn={editModeOn} id={id} />
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <CreateSetDialog fullScreen handleClose={handleCloseDialog} isEditModeOn={editModeOn} id={id} />
          </Hidden>
        </>
      )}
      {isBackButtonDialogOpen && (
        <BackButtonDialog 
          open={isBackButtonDialogOpen} 
          stay={() => setIsBackButtonDialogOpen(false)} 
          goBack={() => {
            setIsBackButtonDialogOpen(false) ;
            onBack();
          }} 
        />
      )}
      {openSnackBar && (
        <CustomSnackBar message={errors.message} onClose={handleCloseSnackBar} />
      )}
      {isSaving && (
        <Spinner />
      )}
    </div>
  );
};

export default ExerciseLayout;
