import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
import Navbar from './navbar';
import Welcome from '../pages/welcome';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Layout = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Navbar />
      <Welcome />
    </div>
  );
};

Layout.propTypes = {};

export default Layout;
