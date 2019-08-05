import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import validate from 'validate.js';

import firebase from '../components/Firebase';
import constraints from '../constraints';

const ResetPassword = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [errors, setErrors] = useState(null);

  function handleResetPassClose() {
    setOpen(false);
    onClose();
  }

  const handleChange = (e) => {
    const email = e.target.value;
    setEmailAddress(email);
  };

  const resetPasswordEmail = async () => {
    const errs = validate(
      {
        emailAddress,
      },
      {
        emailAddress: constraints.emailAddress,
      },
    );

    if (errs) {
      setErrors(errs);
    } else {
      setErrors(null);
      try {
        const results = await firebase.resetPasswordEmail(emailAddress);
        console.log(results);
        debugger;
      } catch (error) {
        console.log(error);
        debugger;
        if (error.code === 'auth/user-not-found') {
          setErrors({ emailAddress: [error.message] });
        }
      }
    }
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div>
      <Dialog open={open} onClose={handleResetPassClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email address associated with your account.
          </DialogContentText>
          <TextField
            autoComplete="email"
            error={!!(errors && errors.emailAddress)}
            fullWidth
            helperText={errors && errors.emailAddress ? errors.emailAddress[0] : ''}
            autoFocus
            margin="normal"
            id="email"
            label="Email Address"
            type="email"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => resetPasswordEmail()} color="primary">
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
