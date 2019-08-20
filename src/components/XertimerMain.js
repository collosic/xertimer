import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import firebase from './Firebase';

// Context
import { AllWorkouts } from '../store/Store';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: '1',
  },
  containerContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '50px 10px',
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
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const XertimerMain = ({ onCreateSetClick }) => {
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const allWorkouts = useContext(AllWorkouts)
  
  useEffect(() => {
    const initCurrentUser = async () => {
      const user = await firebase.getCurrentUser();
      const workouts = [];
      if (user && user.uid) {
        setCurrentUserInfo(user);
        try {
          const snapShot = await firebase.getWorkouts();
          
          snapShot.forEach(doc => {
            workouts.push({ id: doc.id, workout: doc.data() })
          })
        } catch(e) {
          console.log(e);
        }
        allWorkouts.dispatch({ type: 'OVERRIDE', value: workouts })
      }
    };
  
    initCurrentUser();
  }, []);

  const handleClick = () => {
    onCreateSetClick();
  };

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
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                    <Button size="small" color="secondary">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default XertimerMain;
