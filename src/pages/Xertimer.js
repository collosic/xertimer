import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import XertimerMain from '../components/XertimerMain';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Xertimer = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Layout />
      <XertimerMain />
    </div>
  );
};

export default Xertimer;
