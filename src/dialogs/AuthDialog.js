import React, { useState } from 'react';
import { Dialog, Hidden } from '@material-ui/core';
import SignUp from './SignUp';
import Login from './Login';

const AuthLogin = ({ fullScreen, onClose }) => {
  const [open, setOpen] = React.useState(true);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(true);

  const openSignUpDialog = (e) => {
    e.stopPropagation();
    setIsSignUpDialogOpen(true);
    setIsLoginDialogOpen(false);
  };

  const openLoginDialog = (e) => {
    e.stopPropagation();
    setIsLoginDialogOpen(true);
    setIsSignUpDialogOpen(false);
  };

  const handleClose = () => {
    // TODO: make authenticating need to disable the close
    setOpen(false);
    onClose(); // Used to Update the state of the parent component
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      {isSignUpDialogOpen && (
        <React.Fragment>
          <Hidden only="xs">
            <SignUp closeDialog={handleClose} changeDialog={openLoginDialog} />
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <SignUp closeDialog={handleClose} changeDialog={openLoginDialog} />
          </Hidden>
        </React.Fragment>
      )}
      {isLoginDialogOpen && (
        <React.Fragment>
          <Hidden only="xs">
            <Login closeDialog={handleClose} changeDialog={openSignUpDialog} />
          </Hidden>
          <Hidden only={['sm', 'md', 'lg', 'xl']}>
            <Login closeDialog={handleClose} changeDialog={openSignUpDialog} />
          </Hidden>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default AuthLogin;
