import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../components/Firebase';
import Layout from '../components/Layout';
import Welcome from '../components/Welcome';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Home = (props) => {
  const classes = useStyles();

  useEffect(() => {
    const getUser = async () => {
      const user = await firebase.getCurrentUser();
      if (user && user.uid) {
        props.history.replace('/xertimer');
      }
    };
    getUser();
  }, []);

  return (
    <div className={classes.container}>
      <Layout />
      <Welcome />
    </div>
  );
};

export default withRouter(Home);
