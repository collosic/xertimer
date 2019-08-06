import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const CustomSnackBar = ({ message }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={3000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
      />
    </div>
  );
};

export default CustomSnackBar;
