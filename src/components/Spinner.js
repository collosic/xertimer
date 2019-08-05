import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '999',
  },
  progress: {
    margin: theme.spacing(2),
  },
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.overlay}>
      <CircularProgress className={classes.progress} />
    </div>
  );
}
