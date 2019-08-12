import React, { useState, useReducer, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { MenuItem } from '@material-ui/core';
import { NewWorkoutContext } from '../pages/Xertimer';

const useStyles = makeStyles(theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(400 + theme.spacing(2) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const types = [
  {
    value: 'exercise',
    label: 'Exercise Timer',
    details: 'Interval timer that you customize for the given exercise',
  },
  {
    value: 'exerciseNoTimer',
    label: 'Exercise No Timer',
    details:
      'This is a placement card for exercises that require a number of reps instead of a timer',
  },
  {
    value: 'rest',
    label: 'Rest Period',
  },
];

// Initial State
const initCreateCardState = {
  type: '',
  title: '',
  numberOfRepsNoTimer: 0,
  minutes: 0,
  seconds: 0,
  repeat: false,
  numberOfRepetitions: 1,
  addRestToAllRepetitions: false,
  restMinutes: 0,
  restSeconds: 0,
};

// Reducers
const createCardReducer = (state, action) => {
  switch (action.type) {
    case 'resetState':
      return { ...initCreateCardState };
    case 'type':
      return { ...initCreateCardState, type: action.value };
    case 'time':
      return {
        ...state,
        [action.prop]: action.value < 0 || action.value > 59 ? 0 : action.value,
      };
    case 'numberOfRepetitions':
      return {
        ...state,
        numberOfRepetitions:
          action.value < 1 || action.value > 20 ? 1 : action.value,
      };
    case 'repeat':
      if (!action.value) {
        // Will reset the addRestToRepeat field and sub fields
        return {
          ...state,
          repeat: action.value,
          addRestToAllRepetitions: false,
          restMinutes: 0,
          restSeconds: 0,
        };
      }
      return { ...state, repeat: action.value };
    default:
      return { ...state, [action.prop]: action.value };
  }
};

const CreateSetForm = ({ onClose }) => {
  const [createCard, createCardDispatch] = useReducer(
    createCardReducer,
    initCreateCardState,
  );
  const newWorkoutContext = useContext(NewWorkoutContext);
  const [errors, setErrors] = useState(null);
  const classes = useStyles();

  const getDetailsOfType = () => {
    switch (createCard.type) {
      case 'exercise':
        return 'Interval timer that you customize for the given exercise';
      case 'exerciseNoTimer':
        return 'This is a placement card for exercises that require a number or reps instead of a timer';
      default:
        return 'Please select a type';
    }
  };

  const handleNext = () => {
    // Error checking on certain fields
    if (createCard.minutes === 0 && createCard.seconds === 0) {
      setErrors({ seconds: 'Must have a value greater than 0' });
    } else if (
      createCard.addRestToRepeat &&
      createCard.restMinutes === 0 &&
      createCard.restSeconds === 0
    ) {
      setErrors({ restSeconds: 'Must have a value greater than 0' });
    } else {
      newWorkoutContext.dispatch({ type: 'add', value: createCard });
      createCardDispatch({ type: 'resetState' });
      setErrors(null);
    }
  };

  const handleFinish = () => {
    handleNext();
    createCardDispatch({ type: 'resetState' });
    onClose();
  };

  const handleBack = e => {
    if (!newWorkoutContext.state.length) {
      onClose();
    }
  };

  return (
    <>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Create Workout
          </Typography>
          <>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id='standard-select-currency'
                  fullWidth
                  select
                  label='Type'
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  value={createCard.type}
                  onChange={e =>
                    createCardDispatch({
                      type: 'type',
                      value: e.target.value,
                    })
                  }
                  helperText={getDetailsOfType()}
                  margin='normal'
                >
                  {types.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='title'
                  name='title'
                  fullWidth
                  value={createCard.title}
                  label='Exercise Title (Optional)'
                  placeholder='e.g. Pushups'
                  onChange={e =>
                    createCardDispatch({
                      type: 'title',
                      prop: 'title',
                      value: e.target.value,
                    })
                  }
                  disabled={!createCard.type || createCard.type === 'rest'}
                />
              </Grid>
              {createCard.type === 'exerciseNoTimer' ? (
                <Grid item xs={12}>
                  <TextField
                    id='numberOfReps'
                    name='numberOfReps'
                    label='Number of Reps with No Timer (Optional)'
                    type='number'
                    value={createCard.numberOfRepsNoTimer}
                    onChange={e =>
                      createCardDispatch({
                        type: 'numberOfRepsNoTimer',
                        prop: 'numberOfRepsNoTimer',
                        value: e.target.value,
                      })
                    }
                    fullWidth
                    disabled={
                      !createCard.type || createCard.type !== 'exerciseNoTimer'
                    }
                    inputProps={{ min: '1', max: '20', step: '1' }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='minutes'
                      name='minutes'
                      fullWidth
                      value={createCard.minutes}
                      onChange={e =>
                        createCardDispatch({
                          type: 'time',
                          prop: 'minutes',
                          value: e.target.value,
                        })
                      }
                      label='Minutes'
                      type='number'
                      disabled={
                        !createCard.type ||
                        createCard.type === 'exerciseNoTimer'
                      }
                      inputProps={{ min: '1', max: '59', step: '1' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='seconds'
                      name='seconds'
                      label='Seconds'
                      fullWidth
                      error={!!(errors && errors.seconds)}
                      value={createCard.seconds}
                      helperText={errors && errors.seconds}
                      onChange={e =>
                        createCardDispatch({
                          type: 'time',
                          prop: 'seconds',
                          value: e.target.value,
                        })
                      }
                      type='number'
                      disabled={
                        !createCard.type ||
                        createCard.type === 'exerciseNoTimer'
                      }
                      inputProps={{ min: '1', max: '59', step: '1' }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  disabled={!createCard.type || createCard.type === 'rest'}
                  control={
                    <Checkbox
                      color='secondary'
                      name='repeat'
                      checked={createCard.repeat}
                      onChange={(_e, checked) =>
                        createCardDispatch({
                          type: 'repeat',
                          prop: 'repeat',
                          value: checked,
                        })
                      }
                    />
                  }
                  label='Repeat type'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='repeatNumber'
                  name='repeatNumber'
                  label='Number of repetitions'
                  type='number'
                  value={createCard.numberOfRepetitions}
                  onChange={e =>
                    createCardDispatch({
                      type: 'numberOfRepetitions',
                      value: e.target.value,
                    })
                  }
                  fullWidth
                  disabled={!createCard.repeat}
                  inputProps={{ min: '1', max: '20', step: '1' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  disabled={!createCard.repeat}
                  control={
                    <Checkbox
                      color='secondary'
                      name='addRestToAllRepetitions'
                      checked={createCard.addRestToAllRepetitions}
                      onChange={(e, checked) =>
                        createCardDispatch({
                          type: 'addRestToAllRepetitions',
                          prop: 'addRestToAllRepetitions',
                          value: checked,
                        })
                      }
                    />
                  }
                  label='Add rest period between all exercises'
                />
              </Grid>
              {createCard.addRestToAllRepetitions && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='restMinutes'
                      name='restMinutes'
                      fullWidth
                      value={createCard.restMinutes}
                      onChange={e =>
                        createCardDispatch({
                          type: 'time',
                          prop: 'restMinutes',
                          value: e.target.value,
                        })
                      }
                      label='Rest Minutes'
                      type='number'
                      inputProps={{ min: '0', max: '59', step: '1' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='restSeconds'
                      name='restSeconds'
                      label='Rest Seconds'
                      fullWidth
                      error={!!(errors && errors.restSeconds)}
                      helperText={errors && errors.restSeconds}
                      value={createCard.restSeconds}
                      onChange={e =>
                        createCardDispatch({
                          type: 'time',
                          prop: 'restSeconds',
                          value: e.target.value,
                        })
                      }
                      type='number'
                      inputProps={{ min: '0', max: '59', step: '1' }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
          <div className={classes.buttons}>
            <Button onClick={() => handleBack()} className={classes.button}>
              {newWorkoutContext.state.length ? 'Cancel' : 'Back'}
            </Button>
            <Button
              variant='contained'
              color='primary'
              disabled={!createCard.type}
              onClick={() => handleNext()}
              className={classes.button}
            >
              next
            </Button>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => handleFinish()}
              disabled={!createCard.type}
              className={classes.button}
            >
              Finish
            </Button>
          </div>
        </Paper>
      </main>{' '}
    </>
  );
};

export default CreateSetForm;
