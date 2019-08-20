import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteWorkoutDialog = ({ open, onClose, deleteWorkout }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-delete-workout"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle align="center" id="alert-dialog-title">Delete Workout!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you select YES your workout will be gone for good. Are you sure you want to delete this workout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>
            NO
          </Button>
          <Button onClick={() => deleteWorkout()} variant="contained" color="secondary" autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteWorkoutDialog