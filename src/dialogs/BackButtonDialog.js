import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const BackButtonDialog = ({ open, stay, goBack }) => {
  return (
    <div>
      <Dialog
        open={open}
      >
        <DialogTitle align="center" >Warning!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you go back your current workout will not be saved. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => stay()}>
            NO
          </Button>
          <Button onClick={() => goBack()} variant="contained" color="secondary" autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BackButtonDialog