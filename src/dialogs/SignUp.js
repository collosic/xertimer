import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import FacebookBoxIcon from 'mdi-material-ui/FacebookBox';
import GoogleIcon from 'mdi-material-ui/Google';
import constraints from '../constraints';

import firebase from '../components/Firebase';

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
  content: {
    flex: '0 0 auto',
  },
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
  inputFields: {
    width: '100%',
    margin: '16px 0 8px 0',
  },
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
    emailAddress: '',
    password: '',
    passwordConfirmation: '',
    showPassword: false,
    showPasswordConfirmation: false,
  });

  const [errors, setErrors] = useState(null);

  async function createNewAccount({ emailAddress, password }) {
    try {
      await firebase.createAccount(emailAddress, password);
      await firebase.addUserAccount();
    } catch (error) {
      // TODO: error out when email account is already in use
      console.log(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  const signUp = () => {
    const errs = validate(
      {
        emailAddress: values.emailAddress,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password,
        passwordConfirmation: constraints.passwordConfirmation,
      },
    );

    if (errs) {
      setErrors(errs);
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
              <FormControl className={classes.inputFields} error={!!(errors && errors.password)}>
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
                !values.emailAddress
                || !values.password
                || !values.passwordConfirmation
                || isAuthenticating
              }
              variant="contained"
              color="primary"
              fullWidth
              onClick={signUp}
            >
              Login
            </Button>
          </DialogActions>

          <DialogContent className={classes.content}>
            <DialogContentText className={classes.dialogText}>
              <Typography variant="caption">Use social logins</Typography>
            </DialogContentText>
            <DialogActions className={classes.socialIcons}>
              <Tooltip title="Facebook">
                <IconButton
                  className={classes.button}
                  aria-label="delete"
                  disabled={
                    !values.emailAddress
                    || !values.password
                    || !values.passwordConfirmation
                    || isAuthenticating
                  }
                >
                  <FacebookBoxIcon className={classes.facebookIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Google">
                <IconButton
                  className={classes.button}
                  color="primary"
                  disabled={
                    !values.emailAddress
                    || !values.password
                    || !values.passwordConfirmation
                    || isAuthenticating
                  }
                >
                  <GoogleIcon className={classes.googleIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Guest Login">
                <IconButton
                  className={classes.button}
                  aria-label="add an alarm"
                  disabled={
                    !values.emailAddress
                    || !values.password
                    || !values.passwordConfirmation
                    || isAuthenticating
                  }
                >
                  <Icon>account_box</Icon>
                </IconButton>
              </Tooltip>
            </DialogActions>
          </DialogContent>
        </div>
        <DialogActions className={classes.createAccountParent}>
          <Button
            size="small"
            color="secondary"
            className={classes.margin}
            onClick={props.changeDialog}
          >
            Sign In
          </Button>
        </DialogActions>
      </div>
    </div>
  );
};

export default withRouter(SignUp);
