import React, { useState, useEffect, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(400 + theme.spacing(2) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
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
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const types = [
  {
    value: "exercise",
    label: "Exercise Timer",
    details: "Interval timer that you customize for the given exercise",
  },
  {
    value: "exerciseNoTimer",
    label: "Exercise No Timer",
    details:
      "This is a placement card for exercises that require a number of reps instead of a timer",
  },
  {
    value: "rest",
    label: "Rest Period",
  },
];

const initValueState = {
  type: "",
  title: "",
  minutes: 0,
  seconds: 0,
  repeat: false,
  numberOfRepetitions: 1,
  addRestToAllRepetitions: false,
  restMinutes: 0,
  restSeconds: 0,
};

const initTotalWorkout = {
  count: 0,
  sets: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "resetState":
      return { ...initValueState };
    case "type":
      return { ...initValueState, type: action.value };
    case "time":
      return {
        ...state,
        [action.prop]: action.value < 0 || action.value > 59 ? 0 : action.value,
      };
    case "numberOfRepetitions":
      return {
        ...state,
        numberOfRepetitions:
          action.value < 1 || action.value > 20 ? 1 : action.value,
      };
    case "repeat":
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
  const [values, dispatcher] = useReducer(reducer, initValueState);
  const [value, setValues] = useState(initValueState);
  const [totalWorkout, setTotalWorkout] = useState(initTotalWorkout);
  const [isFirstSet, setIsFirstSet] = useState(true);
  const [errors, setErrors] = useState(null);
  const classes = useStyles();

  const getDetailsOfType = () => {
    switch (values.type) {
      case "exercise":
        return "Interval timer that you customize for the given exercise";
      case "exerciseNoTimer":
        return "This is a placement card for exercises that require a number or reps instead of a timer";
      default:
        return "Please select a type";
    }
  };

  const handleNext = () => {
    // Error checking on certain fields
    if (values.minutes === 0 && values.seconds === 0) {
      setErrors({ seconds: "Must have a value greater than 0" });
    } else if (
      values.addRestToRepeat &&
      values.restMinutes === 0 &&
      values.restSeconds === 0
    ) {
      setErrors({ restSeconds: "Must have a value greater than 0" });
    } else {
      const newSets = [...totalWorkout.sets];
      newSets.push(values);
      setTotalWorkout(prevState => ({
        ...prevState,
        count: prevState.count + 1,
        sets: newSets,
      }));
      setErrors(null);
      dispatcher({ type: "resetState" });
    }
  };

  const handleFinish = () => {
    handleNext();
    //onClose(totalWorkout);
  };

  const handleBack = e => {
    if (isFirstSet) {
      onClose();
    }
  };

  return (
    <>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Create Workout {totalWorkout.count}
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
                  value={values.type}
                  onChange={e =>
                    dispatcher({ type: "type", value: e.target.value })
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
                  value={values.title}
                  label='Exercise Title (Optional)'
                  onChange={e =>
                    dispatcher({
                      type: "title",
                      prop: "title",
                      value: e.target.value,
                    })
                  }
                  disabled={!values.type || values.type === "rest"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='minutes'
                  name='minutes'
                  fullWidth
                  value={values.minutes}
                  onChange={e =>
                    dispatcher({
                      type: "time",
                      prop: "minutes",
                      value: e.target.value,
                    })
                  }
                  label='Minutes'
                  type='number'
                  disabled={!values.type || values.type === "exerciseNoTimer"}
                  inputProps={{ min: "1", max: "59", step: "1" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='seconds'
                  name='seconds'
                  label='Seconds'
                  fullWidth
                  error={!!(errors && errors.seconds)}
                  value={values.seconds}
                  helperText={errors && errors.seconds}
                  onChange={e =>
                    dispatcher({
                      type: "time",
                      prop: "seconds",
                      value: e.target.value,
                    })
                  }
                  type='number'
                  disabled={!values.type || values.type === "exerciseNoTimer"}
                  inputProps={{ min: "1", max: "59", step: "1" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  disabled={!values.type || values.type === "rest"}
                  control={
                    <Checkbox
                      color='secondary'
                      name='repeat'
                      checked={values.repeat}
                      onChange={(_e, checked) =>
                        dispatcher({
                          type: "repeat",
                          prop: "repeat",
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
                  label='Number of repititions'
                  type='number'
                  value={values.numberOfRepititions}
                  onChange={() => dispatcher({ type: "numberOfRepititions" })}
                  fullWidth
                  disabled={!values.repeat}
                  inputProps={{ min: "1", max: "20", step: "1" }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  disabled={!values.repeat}
                  control={
                    <Checkbox
                      color='secondary'
                      name='addRestToAllRepetitions'
                      checked={values.addRestToAllRepetitions}
                      onChange={(e, checked) =>
                        dispatcher({
                          type: "addRestToAllRepetitions",
                          prop: "addRestToAllRepetitions",
                          value: checked,
                        })
                      }
                    />
                  }
                  label='Add rest period between all exercises'
                />
              </Grid>
              {values.addRestToAllRepetitions && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='restMinutes'
                      name='restMinutes'
                      fullWidth
                      value={values.restMinutes}
                      onChange={e =>
                        dispatcher({
                          type: "time",
                          prop: "restMinutes",
                          value: e.target.value,
                        })
                      }
                      label='Rest Minutes'
                      type='number'
                      inputProps={{ min: "0", max: "59", step: "1" }}
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
                      value={values.restSeconds}
                      onChange={e =>
                        dispatcher({
                          type: "time",
                          prop: "restSeconds",
                          value: e.target.value,
                        })
                      }
                      type='number'
                      inputProps={{ min: "0", max: "59", step: "1" }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
          <div className={classes.buttons}>
            <Button onClick={() => handleBack()} className={classes.button}>
              {isFirstSet ? "Cancel" : "Back"}
            </Button>
            <Button
              variant='contained'
              color='primary'
              disabled={!values.type}
              onClick={() => handleNext()}
              className={classes.button}
            >
              next
            </Button>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => handleFinish()}
              disabled={!values.type}
              className={classes.button}
            >
              Finish
            </Button>
          </div>
        </Paper>
      </main>{" "}
    </>
  );
};

export default CreateSetForm;
