import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AuthDialog from '../dialogs/AuthDialog';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: '1',
  },
  button: {
    margin: theme.spacing(1),
    width: '200px',
  },
}));

const Welcome = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();

  const openAuthDialog = () => {
    setIsDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setIsDialogOpen(false);
  };

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
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={openAuthDialog}
        >
          <Typography variant="button">Get Started</Typography>
        </Button>
        {isDialogOpen && (
          <React.Fragment>
            <Hidden only="xs">
              <AuthDialog onClose={closeAuthDialog} />
            </Hidden>
            <Hidden only={['sm', 'md', 'lg', 'xl']}>
              <AuthDialog fullScreen onClose={closeAuthDialog} />
            </Hidden>
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Welcome;
