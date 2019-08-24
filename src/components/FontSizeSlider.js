import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import VolumeUp from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

const FontSizeSlider = ({ updateFontSize }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(70);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    updateFontSize(Number(newValue) + 100);
  };

  return (
    <div className={classes.root}>
      <Typography id='input-slider' align='center' gutterBottom>
        Font Size
      </Typography>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs>
          <Slider
            value={value}
            defaultValue={75}
            onChange={handleSliderChange}
            aria-labelledby='input-slider'
            step={10}
            marks
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(FontSizeSlider);
