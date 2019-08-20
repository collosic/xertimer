import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AuthDialog from '../dialogs/AuthDialog';
import Fitness from '../images/fitness.jpg';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundImage: `url(${Fitness})`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
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
    justifyContent: 'center',
    background: 'rgba(204, 204, 204, 0.80)',
    padding: '10px',
  },
  conatianerText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
      <main className={classes.container}>
        <div className={classes.containerContent}>
          <Container maxWidth="sm" className={classes.conatianerText}>
            <Typography variant="h4" gutterBottom>
              Welcome to XerTimer
            </Typography>
            <Typography variant="body1">
              XerTimer is a custom interval timer that will assist you in making timers with
              customized lengths for each rep in a set. You can create multiple sets each with their
              own unique rep and rest times. It also allows you to make manual sets in the cases
              where you are doing set number of reps instead of a timed set.
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              onClick={() => openAuthDialog()}
            >
              <Typography variant="button">Get Started</Typography>
            </Button>
          </Container>
        </div>
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
      </main>
    </React.Fragment>
  );
};

export default Welcome;
