import React from 'react';
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
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Layout />
      <Welcome />
    </div>
  );
};

export default Home;
