import React, { useState, useEffect } from 'react';
import {
  MuiThemeProvider,
  responsiveFontSizes,
  createMuiTheme,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Xertimer from './pages/Xertimer';
import Spinner from './components/Spinner';

import firebase from './components/Firebase';
import { palette, themeName } from './ui/theme';

// Xertimer context
import {
  CurrentWorkoutProvider,
  AllWorkoutsProvider,
  UserSettingsProvider,
} from './store/Store';

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const theme = responsiveFontSizes(createMuiTheme({ palette, themeName }));

  useEffect(() => {
    firebase.isInitialized().then(val => {
      setFirebaseInitialized(val);
    });
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      {firebaseInitialized !== false ? (
        <AllWorkoutsProvider>
          <CurrentWorkoutProvider>
            <UserSettingsProvider>
              <CssBaseline />
              <Router>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/xertimer' component={Xertimer} />
                </Switch>
              </Router>
            </UserSettingsProvider>
          </CurrentWorkoutProvider>
        </AllWorkoutsProvider>
      ) : (
        <Spinner />
      )}
      ;
    </MuiThemeProvider>
  );
}
