import React, { useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Paper, Button, Box } from '@material-ui/core';
import { typography } from '@material-ui/system';
import FontSizeSlider from './FontSizeSlider';

// Styles
const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: '1',
    padding: 20,
  },
  timerBox: {
    width: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 0 auto',
  },
  timer: {},
}));

const initState = {
  timerFontSize: 175,
};

// Reducers
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FONT_SIZE':
      return { ...state, timerFontSize: action.value };
    default:
      return { ...state };
  }
};

const StartWorkout = () => {
  const [state, dispatch] = useReducer(stateReducer, initState);
  const classes = useStyles();

  const handleFontChange = size => {
    console.log(size);
    dispatch({ type: 'SET_FONT_SIZE', value: size });
  };

  return (
    <Container className={classes.container}>
      <Typography variant='h3'>Pushups</Typography>
      <FontSizeSlider updateFontSize={handleFontChange} />
      <Box className={classes.timerBox}>
        <Typography className={classes.timer} component='div'>
          <Box fontSize={state.timerFontSize}>00:45</Box>
        </Typography>
      </Box>
      <Box>
        <Button>Cancel</Button>
        <Button>Pause</Button>
        <Button>Skip</Button>
      </Box>
    </Container>
  );
};

export default React.memo(StartWorkout);
