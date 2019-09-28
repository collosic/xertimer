import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import { PlayArrow, Edit, Delete } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';

// Custom Components
import DeleteWorkoutDialog from '../dialogs/DeleteWorkoutDialog';

import firebase from './Firebase';

// Context
import { AllWorkouts } from '../store/Store';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexGrow: '1',
  },
  containerContent: {
    width: '100%',
    height: 'auto',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: '20px',
    padding: '20px',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      padding: '20px 50px',
    },
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#3c3c3c',
    background:
      'linear-gradient(to bottom, #D5DEE7 0%, #E8EBF2 50%, #E2E7ED 100%), linear-gradient(to bottom, rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.02) 61%, rgba(0,0,0,0.02) 73%), linear-gradient(33deg, rgba(255,255,255,0.20) 0%, rgba(0,0,0,0.20) 100%)',
    backgroundBlendMode: 'normal,color-burn',
  },
  cardHeader: {
    height: 100,
    color: theme.palette.common.white,
    background: theme.palette.secondary.main,
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
    marginTop: -15,
  },
  cardButtons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  startFab: {
    top: 'auto',
    bottom: 20,
    left: 'auto',
    right: 25,
    alignSelf: 'flex-end',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const XertimerMain = ({
  onEditWorkoutClick,
  onCreateSetClick,
  loadWorkouts,
  setLoadWorkouts,
  startTimer,
  setSnackBarMsg,
  openSnackBar,
}) => {
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState(null);
  const allWorkouts = useContext(AllWorkouts);

  const userMsg =
    ' You can create and save your workouts for future use if desired.';
  const guestMsg =
    ' You can create and save workouts, but once your session is terminated your workouts, as a guest, will not be saved.';

  const loadWorkoutsFromFireStore = async () => {
    const workouts = [];
    try {
      const snapShot = await firebase.getWorkouts();
      snapShot.forEach(doc => {
        workouts.push({ id: doc.id, workout: doc.data() });
      });
      allWorkouts.dispatch({ type: 'OVERRIDE', value: workouts });
    } catch (e) {
      console.log(e);
    }
  };

  const openDeleteWorkoutDialog = id => {
    setCurrentCardId(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteWorkout = async () => {
    setIsDeleteDialogOpen(false);
    if (firebase.isGuest) {
      const updatedWorkouts = allWorkouts.state.filter(
        workout => workout.id !== currentCardId,
      );
      sessionStorage.setItem('ALL_WORKOUTS', JSON.stringify(updatedWorkouts));
      setSnackBarMsg('Successfully deleted workout');
      setLoadWorkouts('LOAD_WORKOUTS');
    } else {
      try {
        await firebase.deleteWorkout(currentCardId);
        setSnackBarMsg('Successfully deleted workout');
        loadWorkoutsFromFireStore();
        setLoadWorkouts('DO_NOT_LOAD_WORKOUTS');
      } catch (e) {
        setSnackBarMsg('An error occured while attempting to delete workout');
        console.log(e);
      }
    }

    openSnackBar(true);
  };

  const handleEdit = id => {
    onEditWorkoutClick(id);
  };

  const classes = useStyles();

  useEffect(() => {
    // Initialize the user and load in workouts if they exist
    const initCurrentUser = async () => {
      // THIS NEEDS TO LIVE IN THE STORE
      const user = !currentUserInfo && (await firebase.getCurrentUser());
      if (!currentUserInfo && user && user.uid) {
        setCurrentUserInfo(user);
      }
      if ((user && loadWorkouts) || (firebase.isGuest && loadWorkouts)) {
        if (firebase.isGuest) {
          const workouts = JSON.parse(sessionStorage.getItem('ALL_WORKOUTS'));
          allWorkouts.dispatch({
            type: 'OVERRIDE',
            value: workouts,
          });
        } else {
          loadWorkoutsFromFireStore();
        }
        setLoadWorkouts('DO_NOT_LOAD_WORKOUTS');
      }
    };

    initCurrentUser();
  }, [loadWorkouts]);

  return (
    <>
      <CssBaseline />
      <main className={classes.container}>
        {/* Hero unit */}
        <div className={classes.containerContent}>
          <Container maxWidth='lg'>
            <Box>
              <Typography
                component='h3'
                variant='h3'
                align='center'
                color='textPrimary'
                gutterBottom
              >
                {(currentUserInfo || firebase.isGuest) &&
                  `Welcome ${
                    firebase.isGuest ? 'Guest' : currentUserInfo.displayName
                  }`}
              </Typography>
              <Typography
                variant='h5'
                align='center'
                color='textSecondary'
                paragraph
              >
                Begin creating new customized sets for your workouts.
                {firebase.isGuest ? guestMsg : userMsg}
              </Typography>

              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify='center'>
                  <Grid item>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => onCreateSetClick()}
                    >
                      Create an Exercise
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Box>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth='lg'>
          {/* End hero unit */}
          <Grid container spacing={3}>
            {allWorkouts.state.map(card => (
              <Grid item key={card.id} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card} raised>
                  <CardHeader
                    className={classes.cardHeader}
                    title={card.workout.title}
                    align='center'
                  />
                  <Tooltip title='Start' enterDelay={400}>
                    <Fab
                      color='primary'
                      size='medium'
                      aria-label='start'
                      className={classes.startFab}
                      onClick={() => startTimer(card.id)}
                    >
                      <PlayArrow />
                    </Fab>
                  </Tooltip>
                  <CardContent className={classes.cardContent}>
                    <Typography>{`Sets: ${card.workout.numberOfSets}`}</Typography>
                    <Typography>
                      {`Timer Length: 
                        ${card.workout.timerLength.min < 10 ? '0' : ''}${
                        card.workout.timerLength.min
                      }:${card.workout.timerLength.sec < 10 ? '0' : ''}${
                        card.workout.timerLength.sec
                      }`}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardButtons}>
                    <Tooltip title='Edit' enterDelay={400}>
                      <IconButton
                        onClick={() => handleEdit(card.id)}
                        color='primary'
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete' enterDelay={400}>
                      <IconButton
                        onClick={() => openDeleteWorkoutDialog(card.id)}
                        color='primary'
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {isDeleteDialogOpen && (
          <DeleteWorkoutDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            deleteWorkout={deleteWorkout}
          />
        )}
      </main>
    </>
  );
};

export default React.memo(XertimerMain);
