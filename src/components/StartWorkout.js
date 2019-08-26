import React, { useEffect, useReducer, useContext } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Container, Typography,Box, Tooltip, IconButton } from '@material-ui/core';
import { PlayArrow, Pause, SkipNext, Close } from '@material-ui/icons';
import moment from 'moment';

import FontSizeSlider from './FontSizeSlider';
import SVGCircle from './SVGCircle';
import beep from '../sounds/robot2.mp3';
import chime from '../sounds/chime.mp3';

// Contexts
import { CurrentWorkout } from '../store/Store';

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: '1',
    padding: 40,
    minHeight: '720px',
  },
  slider: {
    padding: 10,
  },
  timerBox: {
    width: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 0 auto',
  },
  clickableCircle: {
    height: 350,
    width: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  centerIcons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigPlayArrow: {
    display: 'flex',
    fontSize: '10rem'
  },
  nextTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    padding: 5,
  },
  upNext: {
    height: 30,
    padding: 5,
  },
  svg: {
    position: 'absolute',
    width: 400,
    height: 400,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: 300,
  },
  button: {
    fontSize: '2rem'
  }
}));

const initState = () => {
  return {
    fontSize: 50,
    seconds: 0,
    isPaused: true,
    color: '#3f51b5',
    index: 0,
    setTimer: 0,
    currentTimer: null,
    timerInterval: null,
    radius: 0,
    sets: null,
    workoutComplete: false,
    countDownSound: new Audio(beep),
    finalSound: new Audio(chime)
  }
};

// From StackOverflow: https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function mapNumber(number, in_min, in_max, out_min, out_max) {
  return (
      ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
}

// Reducers
const stateReducer = (state, action) => {
  switch (action.type) {
    case 'RESEST_STATE':
      return { ...initState }
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.value };
    case 'SET_IS_PAUSED':
      return { ...state, isPaused: action.value, workoutComplete: false }
    case 'NEXT':
      return { 
        ...state, 
        color: action.value[state.index + 1].type === 'REST' ? '#ff7f50' : '#3f51b5',
        index: state.index + 1,
      }
    case 'UPDATE_TIMER':
      return {
        ...state, 
        setTimer: action.value,
        currentTimer: action.value > 0 ? action.value : 0,
        radius: 360 - mapNumber(action.value > 0 ? action.value : 0,
                                action.value > 0 ? action.value : 0, 
                                0, 
                                0, 
                                360)
      }
    case 'DECREMENT_TIMER':
      return { 
        ...state, 
        currentTimer: state.currentTimer > 0 ? state.currentTimer - 1 : 0,
        radius: 360 - mapNumber(state.currentTimer > 0 ? state.currentTimer - 1 : 0, 
                                state.setTimer, 
                                0, 
                                0, 
                                360)
      }
    case 'RADIUS':
      return { ...state, secondsRadius: action.value }
    case 'SET_INTERVAL':
      return { ...state, timerInterval: action.value }
    case 'COMPLETE':
      return { ...state, workoutComplete: true }
    case 'PLAY_SOUND':
      return { ...state }
    default:
      return { ...state };
  }
};

const StartWorkout = ({ goBack }) => {
  const [state, dispatch] = useReducer(stateReducer, initState());
  const classes = useStyles();

  // Global States
  const currentWorkout = useContext(CurrentWorkout);

  const loadTimer = () => {
    const timer = currentWorkout.state.sets[state.index].seconds + 
      (currentWorkout.state.sets[state.index].minutes * 60);
    dispatch({ type: 'UPDATE_TIMER', value: timer })
  }

  const playSound = () => {
    if (state.currentTimer === 0) {
      state.finalSound.play()
    } else {
      state.countDownSound.play()
    }
  }

  const handleFontChange = size => {
    dispatch({ type: 'SET_FONT_SIZE', value: size });
  };

  const goToNext = () => {
    if (state.index < currentWorkout.state.sets.length - 1) {
      dispatch({ type: 'NEXT', value: currentWorkout.state.sets})
      loadTimer();
    } else {
      // timer has ended
      clearInterval(state.timerInterval);
      loadTimer();
      dispatch({ type: 'SET_IS_PAUSED', value: true })
      dispatch({ type: 'COMPLETE' })
    }
  }
  
  const getNextTitle = () => {
    return (state.index < currentWorkout.state.sets.length - 1)
      ? `${currentWorkout.state.sets[state.index + 1].title}`
      : 'One More To Go'
  }
  const handlePlay = () => {
    dispatch({ type: 'SET_IS_PAUSED', value: !state.isPaused })
    // Hack for iOS and Android browswers for sound to work

  }

  const handleExit = () => {
    clearInterval(state.timerInterval);
    goBack();
  }

  useEffect(() => {
    loadTimer();
  }, [])

  useEffect(() => {
    if (!state.isPaused) {
      const timerInterval = setInterval(() => {
        dispatch({ type: 'DECREMENT_TIMER'})
        dispatch({ type: 'PLAY_SOUND'})
      }, 1000);
      dispatch({ type: 'SET_INTERVAL', value: timerInterval })
    } else {
      clearInterval(state.timerInterval);
    }
    
    return () => {
      clearInterval(state.timerInterval)
    };
  }, [state.isPaused])

  return (
    <Container className={classes.container}>
      <Typography variant='h2'>{currentWorkout.state.sets[state.index].title}</Typography>
      <FontSizeSlider 
        updateFontSize={handleFontChange} 
        isDisabled={!state.isPaused}
      />
      <Box className={classes.timerBox}>
        <Typography className={classes.clickableCircle} onClick={() => handlePlay()} component="div">
          <Box className={classes.centerIcons} fontSize={state.fontSize} color={state.color} m={1}>
            {moment.utc(state.currentTimer * 1000).format('mm:ss')}
            {(state.currentTimer !== null && state.currentTimer < 4)
              ? playSound()
              : ''}
          </Box>
        </Typography>

        {state.currentTimer === 0 ? goToNext() : '' }
        <SVGCircle radius={state.radius} color={state.color} svgClass={classes.svg} />
      </Box>
      <Box className={classes.buttons}>
        <Tooltip title='Exit Workout' enterDelay={400}>
          <IconButton onClick={() => handleExit()} color='primary'>
            <Close className={classes.button} />
          </IconButton>
        </Tooltip>
        <Tooltip title={state.isPaused ? 'Play' : 'Pause'} enterDelay={400}>
          <IconButton
            onClick={() => handlePlay()}
            color='primary'
          >
            {state.isPaused ? <PlayArrow className={classes.button} /> : <Pause className={classes.button} /> }
          </IconButton>
        </Tooltip>
        <Tooltip title='Next' enterDelay={400}>
          <IconButton
            onClick={() => goToNext()}
            color='primary'
          >
            <SkipNext className={classes.button} />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography className={classes.upNext} variant='caption'>
        { !state.workoutComplete && state.index < currentWorkout.state.sets.length - 1 ? 'Up Next:' : ''}
      </Typography>
      <Typography className={classes.nextTitle} variant='h5'>
        { state.workoutComplete? 'Completed Workout' : getNextTitle() }
      </Typography>
    </Container>
  );
};

export default React.memo(StartWorkout);
