import React, { useReducer } from 'react';

// Initial States
const initCurrentWorkout = [];

const initAllWorkouts = [];

// Xertimer context
export const CurrentWorkout = React.createContext(initCurrentWorkout);
export const AllWorkouts = React.createContext(initAllWorkouts);

// Reducers
const currentWorkoutReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return initCurrentWorkout;
    case 'ADD':
      return [...state, action.value];
    case 'DELETE':
      return [...state];
    case 'ADJUST':
      return [...action.value];
    default:
      break;
  }
};

const allWorkoutsReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return [ ...initAllWorkouts ];
    case 'ADD':
      return [ ...state, ...action.value];
    case 'OVERRIDE':
      return [ ...action.value ];
    default:
      break;
  }
};

export const CurrentWorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currentWorkoutReducer, initCurrentWorkout);

  return <CurrentWorkout.Provider value={{ state, dispatch }}>{children}</CurrentWorkout.Provider>
}

export const AllWorkoutsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(allWorkoutsReducer, initAllWorkouts);

  return <AllWorkouts.Provider value={{ state, dispatch }}>{children}</AllWorkouts.Provider>
}
