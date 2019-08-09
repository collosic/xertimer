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

const CreateSetForm = ({ onClose }) => {
  const initState = {
    resetValues: false,
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
  const [values, setValues] = useState(initState);
  const [isFirstSet, setIsFirstSet] = useState(true);
  const classes = useStyles();

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
    setValues({ ...initState, type: e.target.value });
  };

  const handleTimeField = prop => (e) => {
    const time = e.target.value;
    setValues({ ...values, [prop]: time < 0 || time > 59 ? 0 : time });
  };

  const handleRepeatChange = prop => (e) => {
    const repeat = e.target.value;
    if (!repeat) {
      setValues({
        ...values,
        addRestToRepeat: false,
        restMinutes: 0,
        restSeconds: 0,
      });
    }
  };

  const handleChange = prop => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleNext = (e) => {};

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
                  value={values.seconds}
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
                      onChange={(e, checked) => handleChange('repeat')({ target: { value: checked } })
                      }
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
                  onChange={handleRepeatChange()}
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
              onClick={() => handleNext()}
              className={classes.button}
            >
              next
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={console.log('next')}
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
