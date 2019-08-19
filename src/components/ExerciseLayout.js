import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Tooltip,
  TextField,
  InputBase,
  Hidden,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ExerciseList from './ExerciseList';
import CreateSetDialog from '../dialogs/CreateSetDialog';

// Styles
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
    justifyContent: 'center',
  },
  layout: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      height: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    height: '100%',
    marginTop: 0,
    marginBottom: 0,
    padding: theme.spacing(2),
    paddingBottom: 64,
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      height: '90%',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  subHeader: {
    display: 'flex',
  },
  subHeaderText: {
    flex: '1 0 auto',
    fontSize: 24,
    textAlign: 'center',
    padding: theme.spacing(0),
  },
  divider: {
    margin: 10,
    backgroundColor: theme.palette.primary.main,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const ExerciseLayout = ({ onBack }) => {
  const [isCreateMode, isCreateModeState] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <div className={classes.subHeader}>
            <Tooltip title='Back'>
              <IconButton onClick={() => onBack()}>
                <Icon>arrow_back</Icon>
              </IconButton>
            </Tooltip>
            <InputBase
              className={classes.subHeaderText}
              autoFocus
              defaultValue='New Workout'
              inputProps={{
                'aria-label': 'workout title',
                style: { textAlign: 'center' },
              }}
            />
            <Tooltip title='Save'>
              <IconButton color='primary'>
                <Icon>save</Icon>
              </IconButton>
            </Tooltip>
          </div>
          <Divider className={classes.divider} variant='fullWidth' />
          <ExerciseList />
        </Paper>
      </main>
      <Tooltip title='Add'>
        <Fab
          color='primary'
          aria-label='add'
          className={classes.fab}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      {isDialogOpen && (
        <>
          <Hidden only='xs'>
            <CreateSetDialog onClose={handleCloseDialog} />
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <CreateSetDialog fullScreen onClose={handleCloseDialog} />
          </Hidden>
        </>
      )}
    </div>
  );
};

export default ExerciseLayout;
