import React, { useState, useEffect } from 'react';
import {
  MuiThemeProvider,
  responsiveFontSizes,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Xertimer from './pages/Xertimer';
import Spinner from './components/Spinner';
import firebase from './components/Firebase';
import createMuiTheme from './ui/theme';

// Xertimer context
import { CurrentWorkoutProvider, AllWorkoutsProvider } from './store/Store';

const theme = responsiveFontSizes(createMuiTheme);

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

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
            <CssBaseline />
            <Router>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/xertimer' component={Xertimer} />
              </Switch>
            </Router>
          </CurrentWorkoutProvider>
        </AllWorkoutsProvider>
      ) : (
        <Spinner />
      )}
      ;
    </MuiThemeProvider>
  );
}
