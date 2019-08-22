import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const CustomSnackBar = ({ message, onClose }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    return () => {
      setOpen(false)
    };
  })

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

export default React.memo(CustomSnackBar);
