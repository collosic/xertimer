import React, { useReducer } from 'react';

// Initial States
const initCurrentWorkout = [];

const initAllWorkouts = {
  sets: [],
};

// Xertimer context
export const CurrentWorkout = React.createContext(initCurrentWorkout);

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
    case 'resetAllWorkoutsState':
      return { ...initAllWorkouts };
    case 'addWorkout':
      return { ...state };
    default:
      break;
  }
};

export const CurrentWorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currentWorkoutReducer, initCurrentWorkout);

  return <CurrentWorkout.Provider value={{ state, dispatch }}>{children}</CurrentWorkout.Provider>
}
