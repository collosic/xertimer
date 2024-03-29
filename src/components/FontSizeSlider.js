import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    padding: 5,
    width: 200,
  },
});

const FontSizeSlider = ({ updateFontSize, isDisabled }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    updateFontSize(Number(newValue) + 80);
  };

  return (
    <div className={classes.root}>
      <Typography id='input-slider' align='center' gutterBottom>
        Font Size
      </Typography>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs>
          <Slider
            disabled={isDisabled}
            value={value}
            onChange={handleSliderChange}
            aria-labelledby='input-slider'
            step={4}
            max={20}
            marks
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(FontSizeSlider);
