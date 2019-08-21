import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
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
import CustomSnackBar from './CustomSnackBar';

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: '20px',
    padding: '20px',
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      padding: '20px 50px'
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
    backgroundColor: '#E4E4E1',
    backgroundImage: 'radial-gradient(at top center, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.03) 100%), linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(143,152,157,0.60) 100%)',
 	  backgroundBlendMode: 'normal, multiply',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  cardButtons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const XertimerMain = ({ onCreateSetClick }) => {
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const allWorkouts = useContext(AllWorkouts)

  const loadWorkoutsFromFireStore = async () => {
    const workouts = [];
    try {
      const snapShot = await firebase.getWorkouts();
      snapShot.forEach(doc => {
        workouts.push({ id: doc.id, workout: doc.data() })
      })
      allWorkouts.dispatch({ type: 'OVERRIDE', value: workouts })
    } catch(e) {
      console.log(e);
    }
  }
  
  useEffect(() => {
    const initCurrentUser = async () => {
      const user = await firebase.getCurrentUser();
      if (user && user.uid) {
        setCurrentUserInfo(user);
        loadWorkoutsFromFireStore();
      }
    };
    initCurrentUser();
  }, []);

  const handleClick = () => {
    onCreateSetClick();
  };

  const openDeleteWorkoutDialog = (id) => {
    setCurrentCardId(id);
    setIsDeleteDialogOpen(true);
  }

  const deleteWorkout = async () => {
    setIsDeleteDialogOpen(false);
    try {
      await firebase.deleteWorkout(currentCardId);
      setSnackBarMsg('Successfully deleted workout')
      loadWorkoutsFromFireStore();
    } catch (e) {
      setSnackBarMsg('An error occured while attempting to delete workout');
      console.log(e)
    }
    setOpenSnackBar(true);
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }
  
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <main className={classes.container}>
        {/* Hero unit */}
        <div className={classes.containerContent}>
          <Container maxWidth="lg">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              {currentUserInfo && `Welcome ${currentUserInfo.displayName}`}
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Begin creating new customized sets for your workouts. You can name and save your sets
              for future use if desired.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => handleClick()}>
                    Create a Set
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={3}>
            {allWorkouts.state.map(card => (
              <Grid item key={card.id} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                  {/* <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  /> */}
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.workout.title}
                    </Typography>
                    <Typography>{`Sets: ${card.workout.numberOfSets}`}</Typography>
                    <Typography>
                      {`Timer Length: 
                        ${card.workout.timerLength.min < 10 ? '0' : ''}${card.workout.timerLength.min}:${card.workout.timerLength.sec < 10 ? '0' : ''}${card.workout.timerLength.sec}`}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardButtons}>
                    <Tooltip title="Start">
                      <IconButton color="primary">
                        <PlayArrow />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => openDeleteWorkoutDialog(card.id)} color="secondary">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {(isDeleteDialogOpen && (
          <DeleteWorkoutDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} deleteWorkout={deleteWorkout} />
        ))}
        {openSnackBar && (
          <CustomSnackBar message={snackBarMsg} onClose={handleCloseSnackBar} />
        )}
      </main>
    </>
  );
};

export default XertimerMain;
