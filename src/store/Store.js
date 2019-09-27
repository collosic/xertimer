import React, { useReducer } from 'react';

// Initial States
const initCurrentWorkout = {
  workoutId: null,
  sets: [],
};

const initAllWorkouts = [];
const initUserSettings = {
  theme: {
    name: 'Persian Indigo Dove Gray Bird',
    isLightTheme: true,
  },
};

// Xertimer context
export const CurrentWorkout = React.createContext(initCurrentWorkout);
export const AllWorkouts = React.createContext(initAllWorkouts);
export const UserSettings = React.createContext(initUserSettings);

// Reducers
const currentWorkoutReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return initCurrentWorkout;
    case 'ADD':
      return { ...state, sets: [...state.sets, action.value] };
    case 'DELETE':
      return { ...state };
    case 'OVERRIDE':
      return { ...state, sets: action.value };
    case 'EDIT_MODE_OVERRIDE':
      return { ...action.value };
    default:
      break;
  }
};

const allWorkoutsReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return [...initAllWorkouts];
    case 'ADD':
      return [...state, ...action.value];
    case 'OVERRIDE':
      return [...action.value];
    default:
      break;
  }
};

const userSettingsReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_SETTINGS':
      return { ...initUserSettings };
    case 'CHANGE_THEME_TYPE':
      return { ...state, theme: { isLightTheme: action.value } };
    default:
      return { ...state };
  }
};

export const CurrentWorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    currentWorkoutReducer,
    initCurrentWorkout,
  );

  return (
    <CurrentWorkout.Provider value={{ state, dispatch }}>
      {children}
    </CurrentWorkout.Provider>
  );
};

export const AllWorkoutsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(allWorkoutsReducer, initAllWorkouts);

  return (
    <AllWorkouts.Provider value={{ state, dispatch }}>
      {children}
    </AllWorkouts.Provider>
  );
};

export const UserSettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userSettingsReducer, initUserSettings);

  return (
    <UserSettings.Provider value={{ state, dispatch }}>
      {children}
    </UserSettings.Provider>
  );
};
