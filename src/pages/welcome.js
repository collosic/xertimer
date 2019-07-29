import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: '1',
  },
  center: {},
  button: {
    margin: theme.spacing(1),
    width: '200px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);

console.log(firebase.auth());
console.log(firebase.database().ref('users'));

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccess: () => false,
  },
};

const Welcome = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Welcome to XerTimer
        </Typography>
        <Typography variant="body1">
          XerTimer is a custom interval timer that will assist you in making timers with different
          lengths for each set. It also allows to make manual sets in the cases where you are doing
          set number of reps instead of a timed set.
        </Typography>
        <Button variant="contained" color="primary" size="large" className={classes.button}>
          <Typography variant="button">Get Started</Typography>
        </Button>
      </Container>
    </React.Fragment>
  );
};

export default Welcome;
