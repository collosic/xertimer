import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { MenuItem } from '@material-ui/core';

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

const CreateSetForm = ({ onClose, updateState }) => {
  const initValueState = {
    type: '',
    title: '',
    minutes: 0,
    seconds: 0,
    repeat: false,
    numberOfRepititions: 1,
    addRestToRepeat: false,
    restMinutes: 0,
    restSeconds: 0,
  };
  const initTotalWorkout = {
    count: 0,
    sets: [],
  };
  const [values, setValues] = useState(initValueState);
  const [totalWorkout, setTotalWorkout] = useState(initTotalWorkout);
  const [isFirstSet, setIsFirstSet] = useState(true);
  const [errors, setErrors] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    updateState(totalWorkout.sets);
  }, [totalWorkout.sets]);

  const getDetailsOfType = () => {
    switch (values.type) {
      case 'exercise':
        return 'Interval timer that you customize for the given exercise';
      case 'exerciseNoTimer':
        return 'This is a placement card for exercises that require a number or reps instead of a timer';
      default:
        return 'Please select a type';
    }
  };

  const handleTypeChange = prop => (e) => {
    setValues({ ...initValueState, type: e.target.value });
  };

  const handleTimeField = prop => (e) => {
    const time = e.target.value;
    setValues({ ...values, [prop]: time < 0 || time > 59 ? 0 : time });
  };

  const handleRepeatChange = (e) => {
    const repeat = e;
    if (!repeat) {
      setValues({
        ...values,
        repeat,
        addRestToRepeat: false,
        restMinutes: 0,
        restSeconds: 0,
      });
    } else {
      setValues({ ...values, repeat });
    }
  };

  const handleNumOfRepititions = prop => (e) => {
    const num = e.target.value;
    setValues({ ...values, numberOfRepititions: num < 1 || num > 20 ? 1 : num });
  };

  const handleChange = prop => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleNext = () => {
    // Error checking on certain fields
    if (values.minutes === 0 && values.seconds === 0) {
      setErrors({ seconds: 'Must have a value greater than 0' });
    } else if (values.addRestToRepeat && values.restMinutes === 0 && values.restSeconds === 0) {
      setErrors({ restSeconds: 'Must have a value greater than 0' });
    } else {
      const newSets = [...totalWorkout.sets];
      newSets.push(values);
      setTotalWorkout(prevSet => ({ count: prevSet.count + 1, sets: newSets }));
      setErrors(null);
      setValues({ ...initValueState });
      console.log(totalWorkout);
    }
  };

  const handleFinish = () => {
    handleNext();
    onClose(totalWorkout);
  };

  const handleBack = (e) => {
    if (isFirstSet) {
      onClose();
    }
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create Workout
            {' '}
            {totalWorkout.count}
          </Typography>
          <React.Fragment>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  id="standard-select-currency"
                  fullWidth
                  select
                  label="Type"
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  value={values.type}
                  onChange={handleTypeChange()}
                  helperText={getDetailsOfType()}
                  margin="normal"
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
                  id="title"
                  name="title"
                  fullWidth
                  value={values.title}
                  label="Exerice Title (Optional)"
                  onChange={handleChange('title')}
                  disabled={!values.type || values.type === 'rest'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="minutes"
                  name="minutes"
                  fullWidth
                  value={values.minutes}
                  onChange={handleTimeField('minutes')}
                  label="Minutes"
                  type="number"
                  disabled={!values.type || values.type === 'exerciseNoTimer'}
                  inputProps={{ min: '1', max: '59', step: '1' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="seconds"
                  name="seconds"
                  label="Seconds"
                  fullWidth
                  error={!!(errors && errors.seconds)}
                  value={values.seconds}
                  helperText={errors && errors.seconds}
                  onChange={handleTimeField('seconds')}
                  type="number"
                  disabled={!values.type || values.type === 'exerciseNoTimer'}
                  inputProps={{ min: '1', max: '59', step: '1' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  disabled={!values.type || values.type === 'rest'}
                  control={(
                    <Checkbox
                      color="secondary"
                      name="repeat"
                      checked={values.repeat}
                      onChange={(e, checked) => handleRepeatChange(checked)}
                    />
)}
                  label="Repeat card"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="repeatNumber"
                  name="repeatNumber"
                  label="Number of repititions"
                  type="number"
                  value={values.numberOfRepititions}
                  onChange={handleNumOfRepititions()}
                  fullWidth
                  disabled={!values.repeat}
                  inputProps={{ min: '1', max: '20', step: '1' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  disabled={!values.repeat}
                  control={(
                    <Checkbox
                      color="secondary"
                      name=""
                      checked={values.addRestToRepeat}
                      onChange={(e, checked) => handleChange('addRestToRepeat')({ target: { value: checked } })
                      }
                    />
)}
                  label="Add rest period between exercises"
                />
              </Grid>
              {values.addRestToRepeat && (
                <React.Fragment>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="restMinutes"
                      name="restMinutes"
                      fullWidth
                      value={values.restMinutes}
                      onChange={handleTimeField('restMinutes')}
                      label="Rest Minutes"
                      type="number"
                      inputProps={{ min: '0', max: '59', step: '1' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="restSeconds"
                      name="restSeconds"
                      label="Rest Seconds"
                      fullWidth
                      error={!!(errors && errors.restSeconds)}
                      helperText={errors && errors.restSeconds}
                      value={values.restSeconds}
                      onChange={handleTimeField('restSeconds')}
                      type="number"
                      inputProps={{ min: '0', max: '59', step: '1' }}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </React.Fragment>
          <div className={classes.buttons}>
            <Button onClick={() => handleBack()} className={classes.button}>
              {isFirstSet ? 'Cancel' : 'Back'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!values.type}
              onClick={() => handleNext()}
              className={classes.button}
            >
              next
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleFinish()}
              disabled={!values.type}
              className={classes.button}
            >
              Finish
            </Button>
          </div>
        </Paper>
      </main>
      {' '}
    </React.Fragment>
  );
};

export default CreateSetForm;
