import React, { useState, useReducer, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { MenuItem } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import uuid from 'uuid';

import { CurrentWorkout } from '../store/Store'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  layout: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.up(400 + theme.spacing(2) * 2)]: {
      width: 600,
      height: '100%',
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
    margin: 5,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
}));

const types = [
  {
    value: 'EXERCISE',
    label: 'Exercise Timer',
    details: 'Interval timer that you customize for the given exercise',
  },
  {
    value: 'EXERCISE_NO_TIMER',
    label: 'Exercise No Timer',
    details:
      'This is a placement card for exercises that require a number of reps instead of a timer',
  },
  {
    value: 'REST',
    label: 'Rest Period',
  },
];

// Initial State
const initCreateCardState = {
  uuid: null,
  type: '',
  title: '',
  numberOfRepsNoTimer: 0,
  minutes: 0,
  seconds: 0,
  x_repeat: false,
  x_numberOfRepetitions: 1,
  x_addRestToAllRepetitions: false,
  x_restMinutes: 0,
  x_restSeconds: 0,
};

// Reducers
const createCardReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return { ...initCreateCardState };
    case 'TYPE':
      return { ...state, type: action.value, uuid: uuid.v4() };
    case 'TIME':
      return {
        ...state,
        [action.prop]:
          action.value < 0 || action.value > 59 ? 0 : Number(action.value),
      };
    case 'NUM_OF_REPETITIONS':
      return {
        ...state,
        x_numberOfRepetitions:
          action.value < 1 || action.value > 20 ? 1 : action.value,
      };
    case 'REPEAT':
      if (!action.value) {
        // Will reset the addRestToRepeat field and sub fields
        return {
          ...state,
          x_repeat: action.value,
          x_addRestToAllRepetitions: false,
          x_restMinutes: 0,
          x_restSeconds: 0,
        };
      }
      return { ...state, x_repeat: action.value };
    default:
      return { ...state, [action.prop]: action.value };
  }
};

// Component
const CreateSetForm = ({ onClose, fullScreen }) => {
  const [createCard, createCardDispatch] = useReducer(
    createCardReducer,
    initCreateCardState,
  );
  const newWorkoutContext = useContext(CurrentWorkout);
  const [isOpen, setIsOpen] = useState(true);
  const [errors, setErrors] = useState(null);
  const classes = useStyles();

  const getDetailsOfType = () => {
    switch (createCard.type) {
      case 'EXERCISE':
        return 'Interval timer that you customize for the given exercise';
      case 'EXERCISE_NO_TIMER':
        return 'This is a placement card for exercises that require a number or reps instead of a timer';
      default:
        return 'Please select a type';
    }
  };

  const createRepeatedWorkout = () => {
    const numReps = Number(createCard.x_numberOfRepetitions);
    const numTotalCards =
      numReps +
      (createCard.x_addRestToAllRepetitions
        ? Number(createCard.x_numberOfRepetitions) - 1
        : 0);
    const cardIterator = [...Array(numTotalCards).keys()];
    const totalWorkout = cardIterator.map(index => {
      return createCard.x_addRestToAllRepetitions && index % 2
        ? {
            uuid: uuid.v4(),
            type: 'REST',
            title: 'Rest Period',
            numberOfRepsNoTimer: createCard.numberOfRepsNoTimer,
            minutes: createCard.x_restMinutes,
            seconds: createCard.x_restSeconds,
          }
        : {
            uuid: uuid.v4(),
            type: createCard.type,
            title: createCard.title,
            numberOfRepsNoTimer: createCard.numberOfRepsNoTimer,
            minutes: createCard.minutes,
            seconds: createCard.seconds,
          };
    });
    newWorkoutContext.dispatch({ type: 'ADJUST', value: totalWorkout });
  };

  const handleNext = () => {
    // Error checking on certain fields
    if (
      createCard.type !== 'EXERCISE_NO_TIMER' &&
      createCard.minutes === 0 &&
      createCard.seconds === 0
    ) {
      setErrors({ seconds: 'Must have a value greater than 0' });
    } else if (
      createCard.x_addRestToAllRepetitions &&
      createCard.x_restMinutes === 0 &&
      createCard.x_restSeconds === 0
    ) {
      setErrors({ x_restSeconds: 'Must have a value greater than 0' });
    } else if (createCard.x_repeat) {
      createRepeatedWorkout();
      createCardDispatch({ type: 'RESET_STATE' });
      setErrors(null);
    } else {
      newWorkoutContext.dispatch({ type: 'ADD', value: createCard });
      createCardDispatch({ type: 'RESET_STATE' });
      setErrors(null);
    }
  };

  const handleFinish = () => {
    handleNext();
    onClose();
  };

  const handleBack = e => {
    if (!newWorkoutContext.state.length) {
      onClose();
    }
  };

  const handleRestTitle = () => {
    createCard.title = 'Rest Period';
    return createCard.title;
  };

  return (
    <>
      <div className={classes.outerContainer}>
        <Dialog
          fullScreen={fullScreen}
          open={isOpen}
          className={classes.layout}
        >
          <DialogTitle className={classes.title}>Create Set</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id='type-selector'
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
                      type: 'TYPE',
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
                  required
                  fullWidth
                  value={
                    createCard.type === 'REST'
                      ? handleRestTitle()
                      : createCard.title
                  }
                  label='Exercise Title'
                  placeholder='e.g. Pushups'
                  onChange={e =>
                    createCardDispatch({
                      type: 'title',
                      prop: 'title',
                      value: e.target.value,
                    })
                  }
                  disabled={!createCard.type || createCard.type === 'REST'}
                />
              </Grid>
              {createCard.type === 'EXERCISE_NO_TIMER' ? (
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
                      !createCard.type ||
                      createCard.type !== 'EXERCISE_NO_TIMER'
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
                          type: 'TIME',
                          prop: 'minutes',
                          value: e.target.value,
                        })
                      }
                      label='Minutes'
                      type='number'
                      disabled={
                        !createCard.type ||
                        createCard.type === 'EXERCISE_NO_TIMER'
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
                          type: 'TIME',
                          prop: 'seconds',
                          value: e.target.value,
                        })
                      }
                      type='number'
                      disabled={
                        !createCard.type ||
                        createCard.type === 'EXERCISE_NO_TIMER'
                      }
                      inputProps={{ min: '1', max: '59', step: '1' }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  disabled={!createCard.type || createCard.type === 'REST'}
                  control={
                    <Checkbox
                      color='secondary'
                      name='REPEAT'
                      checked={createCard.x_repeat}
                      onChange={(_e, checked) =>
                        createCardDispatch({
                          type: 'REPEAT',
                          prop: 'x_repeat',
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
                  value={createCard.x_numberOfRepetitions}
                  onChange={e =>
                    createCardDispatch({
                      type: 'NUM_OF_REPETITIONS',
                      prop: 'x_numberOfRepetitions',
                      value: e.target.value,
                    })
                  }
                  fullWidth
                  disabled={!createCard.x_repeat}
                  inputProps={{ min: '1', max: '20', step: '1' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  id='add-rest-period'
                  disabled={!createCard.x_repeat}
                  control={
                    <Checkbox
                      color='secondary'
                      name='addRestToAllRepetitions'
                      checked={createCard.x_addRestToAllRepetitions}
                      onChange={(e, checked) =>
                        createCardDispatch({
                          type: 'addRestToAllRepetitions',
                          prop: 'x_addRestToAllRepetitions',
                          value: checked,
                        })
                      }
                    />
                  }
                  label='Add rest period between all exercises'
                />
                <FormHelperText id='add-rest-period'>
                  By checking the above box you will complete an entire workout
                </FormHelperText>
              </Grid>
              {createCard.x_addRestToAllRepetitions && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='restMinutes'
                      name='restMinutes'
                      fullWidth
                      value={createCard.x_restMinutes}
                      onChange={e =>
                        createCardDispatch({
                          type: 'TIME',
                          prop: 'x_restMinutes',
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
                      error={!!(errors && errors.x_restSeconds)}
                      helperText={errors && errors.x_restSeconds}
                      value={createCard.x_restSeconds}
                      onChange={e =>
                        createCardDispatch({
                          type: 'TIME',
                          prop: 'x_restSeconds',
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
          </DialogContent>
          <DialogActions>
            <div className={classes.buttons}>
              <Button onClick={() => handleBack()} className={classes.button}>
                {!newWorkoutContext.state.length ? 'Cancel' : 'Back'}
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
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CreateSetForm;
