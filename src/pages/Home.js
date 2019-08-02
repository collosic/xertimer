import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../components/Firebase';
import Layout from '../components/Layout';
import Welcome from '../components/Welcome';
import Xertimer from './Xertimer';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Home = () => {
  const [appStatus, setAppStatus] = useState({
    isSignedIn: false,
    isSignUpDialogOpen: false,
    isSignInDialogOpen: false,
  });

  // Check and see if a user is currently signed in
  const { currentUser } = firebase.auth;

  if (currentUser && currentUser.uid) {
    setAppStatus({ ...appStatus, isSignedIn: true });
  }

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Layout />
      {!appStatus.isSignedIn && <Welcome />}
      {appStatus.isSignedIn && <Xertimer />}
    </div>
  );
};

export default Home;
