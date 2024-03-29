import React, { useState } from 'react';
import { Hidden, Typography } from '@material-ui/core';
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

import FacebookBoxIcon from 'mdi-material-ui/FacebookBox';
import GoogleIcon from 'mdi-material-ui/Google';
import constraints from '../constraints';

import firebase from '../components/Firebase';

import ResetPassword from './ResetPassword';
import Spinner from '../components/Spinner';
import CustomSnackBar from '../components/CustomSnackBar';

const useStyles = makeStyles(theme => ({
  outerContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up(444)]: {
      minWidth: '444px',
    },
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formsContainer: {
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
  },
  button: {
    margin: theme.spacing(0),
  },
  title: {
    width: '100%',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
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
  forgotPass: {
    cursor: 'pointer',
    marginTop: '5px',
  },
}));

const Login = props => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isResetPassDialogOpen, setResetPassDialogOpen] = useState(false);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const [values, setValues] = useState({
    emailAddress: '',
    password: '',
    showPassword: false,
  });
  const [errors, setErrors] = useState(null);

  const setAuthenticating = flag => {
    setIsAuthenticating(flag);
    props.onAuthenticating(flag);
  };

  const signIn = () => {
    setAuthenticating(true);
    async function signInUser({ emailAddress, password }) {
      try {
        await firebase.login(emailAddress, password);
        setAuthenticating(false);
        props.history.replace('/Xertimer');
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          setErrors({ password: ['The password is invalid'] });
        } else if (error.code === 'auth/user-not-found') {
          setErrors({ emailAddress: ['User not found'] });
        } else {
          setErrors({ emailAddress: [error.message] });
        }
        setAuthenticating(false);
      }
    }

    const errs = validate(
      {
        emailAddress: values.emailAddress,
        password: values.password,
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password,
      },
    );

    if (errs) {
      setErrors(errs);
      setAuthenticating(false);
    } else {
      setErrors(null);
      signInUser(values);
    }
  };

  const determineIfNewUserandRoute = async results => {
    const newUser = results.additionalUserInfo.isNewUser;
    if (newUser) {
      const userData = {
        uid: results.user.uid,
        email: results.user.email,
      };
      await firebase.addUserAccount(userData);
      props.history.replace('/Xertimer');
    } else {
      props.history.replace('/Xertimer');
    }
  };

  async function signInWithProvider(provider) {
    setAuthenticating(true);
    try {
      const results = await firebase.signInWithProvider(provider);
      determineIfNewUserandRoute(results);
    } catch (error) {
      // TODO: error out when email account is already in use
      setAuthenticating(false);
      console.log(error.message);
    }
  }

  const signInAnonymously = async () => {
    setAuthenticating(true);
    firebase.signInAnonymously();
    props.history.replace('/Xertimer');
  };

  const openSnackBar = () => {
    setIsSnackBarOpen(true);
  };

  const handleClickShowPassword = prop => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const openResetPassDialog = () => {
    setResetPassDialogOpen(true);
  };

  const closeResetPassDialog = () => {
    setResetPassDialogOpen(false);
  };

  const classes = useStyles();

  return (
    <div className={classes.outerContainer}>
      <div className={classes.container}>
        <DialogTitle className={classes.title}>Log into XerTimer</DialogTitle>
        <div className={classes.formsContainer}>
          <DialogContent className={classes.content}>
            <form>
              <TextField
                autoComplete='email'
                error={!!(errors && errors.emailAddress)}
                fullWidth
                helperText={
                  errors && errors.emailAddress ? errors.emailAddress[0] : ''
                }
                label='E-mail address'
                margin='normal'
                onChange={handleChange('emailAddress')}
                type='email'
                value={values.emailAddress}
              />
              <FormControl
                className={classes.inputFields}
                error={!!(errors && errors.password)}
              >
                <InputLabel htmlFor='adornment-password'>Password</InputLabel>
                <Input
                  id='adornment-password'
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword('showPassword')}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id='adornment-password'>
                  {errors && errors.password ? errors.password[0] : ''}
                </FormHelperText>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button
              className={classes.button}
              disabled={
                !values.emailAddress || !values.password || isAuthenticating
              }
              variant='contained'
              color='secondary'
              fullWidth
              onClick={() => signIn()}
            >
              Login
            </Button>
            <Typography
              onClick={() => openResetPassDialog()}
              className={classes.forgotPass}
              variant='caption'
              style={{ cursor: 'pointer' }}
              color='textPrimary'
            >
              Reset Password?
            </Typography>
          </DialogActions>

          <DialogContent className={classes.content}>
            <DialogContentText className={classes.dialogText}>
              <Typography variant='caption'>Or use the following</Typography>
            </DialogContentText>
            <DialogActions className={classes.socialIcons}>
              <Tooltip title='Facebook'>
                <IconButton
                  className={classes.button}
                  aria-label='delete'
                  disabled={isAuthenticating}
                >
                  <FacebookBoxIcon className={classes.facebookIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Google'>
                <IconButton
                  className={classes.button}
                  color='primary'
                  disabled={isAuthenticating}
                  onClick={() =>
                    signInWithProvider(firebase.getGoogleProvider())
                  }
                >
                  <GoogleIcon className={classes.googleIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Guest Login'>
                <IconButton
                  className={classes.button}
                  aria-label='add an alarm'
                  disabled={isAuthenticating}
                  onClick={() => signInAnonymously()}
                >
                  <Icon>account_box</Icon>
                </IconButton>
              </Tooltip>
            </DialogActions>
          </DialogContent>
        </div>
        <DialogActions className={classes.createAccountParent}>
          <Button
            size='small'
            color='secondary'
            className={classes.margin}
            onClick={props.changeDialog}
          >
            Create Account?
          </Button>
        </DialogActions>
      </div>
      {isResetPassDialogOpen && (
        <>
          <Hidden only='xs'>
            <ResetPassword
              onClose={closeResetPassDialog}
              onEmailSent={openSnackBar}
            />
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <ResetPassword
              fullScreen
              onClose={closeResetPassDialog}
              onEmailSent={openSnackBar}
            />
          </Hidden>
        </>
      )}
      {isAuthenticating && <Spinner />}
      {isSnackBarOpen && <CustomSnackBar message='Email sent successfully' />}
    </div>
  );
};

export default withRouter(Login);
