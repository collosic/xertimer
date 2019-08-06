import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import validate from 'validate.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import constraints from '../constraints';

import firebase from '../components/Firebase';

import Spinner from '../components/Spinner';

const useStyles = makeStyles(theme => ({
  outerContainer: {
    height: '550px',
    width: '400px',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
  },
  formsContainer: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing(0),
  },
  title: {},
  content: {},
  dialogActions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  inputFields: { height: '48px' },
  dialogText: {
    textAlign: 'center',
    marginBottom: '0',
  },
  createAccountParent: {
    display: 'flex',
    justifyContent: 'center',
  },
  createAccount: {
    textAlign: 'center',
  },
  facebookIcon: {
    color: '#3b5999',
  },
  googleIcon: {
    color: '#DB4437',
  },
}));

const SignUp = (props) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [values, setValues] = useState({
    name: '',
    emailAddress: '',
    password: '',
    passwordConfirmation: '',
    showPassword: false,
    showPasswordConfirmation: false,
  });

  const [errors, setErrors] = useState(null);

  const setAuthenticating = (flag) => {
    setIsAuthenticating(flag);
    props.onAuthenticating(flag);
  };

  async function createNewAccount({ emailAddress, password }) {
    try {
      await firebase.createAccount(emailAddress, password);
      await firebase.initEmailProfile(values.name);
      setAuthenticating(false);
      props.history.replace('/xertimer');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ emailAddress: [error.message] });
      } else if (error.code === 'auth/user-not-found') {
        setErrors({ emailAddress: ['User not found'] });
      } else {
        setErrors({ emailAddress: [error.message] });
      }
      setAuthenticating(false);
      console.log(error.message);
    }
  }

  const signUp = () => {
    setAuthenticating(true);
    const errs = validate(
      {
        firstName: values.name,
        emailAddress: values.emailAddress,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      },
      {
        firstName: constraints.firstName,
        emailAddress: constraints.emailAddress,
        password: constraints.password,
        passwordConfirmation: constraints.passwordConfirmation,
      },
    );

    if (errs) {
      setErrors(errs);
      setAuthenticating(false);
    } else {
      setErrors(null);
      createNewAccount(values);
    }
  };

  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = prop => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();

  return (
    <div className={classes.outerContainer}>
      <div className={classes.container}>
        <DialogTitle className={classes.title}>Create Xertimer Account</DialogTitle>
        <div className={classes.formsContainer}>
          <DialogContent className={classes.content}>
            <form>
              <TextField
                autoComplete="name"
                error={!!(errors && errors.name)}
                fullWidth
                helperText={errors && errors.name ? errors.name[0] : ''}
                label="Name"
                margin="normal"
                onChange={handleChange('name')}
                type="email"
                value={values.name}
              />
              <TextField
                autoComplete="email"
                error={!!(errors && errors.emailAddress)}
                fullWidth
                helperText={errors && errors.emailAddress ? errors.emailAddress[0] : ''}
                label="E-mail address"
                margin="normal"
                onChange={handleChange('emailAddress')}
                type="email"
                value={values.emailAddress}
              />
              <FormControl
                margin="normal"
                fullWidth
                className={classes.inputFields}
                error={!!(errors && errors.password)}
              >
                <InputLabel htmlFor="adornment-password">Password</InputLabel>
                <Input
                  id="adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('showPassword')}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
)}
                />
                <FormHelperText id="adornment-password">
                  {errors && errors.password ? errors.password[0] : ''}
                </FormHelperText>
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                className={classes.inputFields}
                error={!!(errors && errors.passwordConfirmation)}
              >
                <InputLabel htmlFor="adornment-passwordConfirmation">Confirm Password</InputLabel>
                <Input
                  id="adornment-passwordConfirmation"
                  type={values.showPasswordConfirmation ? 'text' : 'password'}
                  value={values.passwordConfirmation}
                  onChange={handleChange('passwordConfirmation')}
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword('showPasswordConfirmation')}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPasswordConfirmation ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
)}
                />
                <FormHelperText id="adornment-passwordConfirmation">
                  {errors && errors.passwordConfirmation ? errors.passwordConfirmation[0] : ''}
                </FormHelperText>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button
              className={classes.button}
              disabled={
                !values.name
                || !values.emailAddress
                || !values.password
                || !values.passwordConfirmation
                || isAuthenticating
              }
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => signUp()}
            >
              Sign Up
            </Button>
          </DialogActions>
        </div>
        <DialogActions className={classes.createAccountParent}>
          <Button
            size="small"
            color="secondary"
            className={classes.margin}
            onClick={props.changeDialog}
          >
            Trying to Sign In?
          </Button>
        </DialogActions>
      </div>
      {isAuthenticating && <Spinner />}
    </div>
  );
};

export default withRouter(SignUp);
