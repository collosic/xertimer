import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReorderIcon from '@material-ui/icons/Reorder';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { CurrentWorkout } from '../store/Store';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    listStyleType: 'none',
  },
  reorderIcon: {
    cursor: 'grab',
    pointerEvents: 'auto !important',
    '&:active': {
      cursor: 'grabbing !important',
    },
  },
}));

const ExerciseList = ({ onEdit }) => {
  const currentWorkoutContext = useContext(CurrentWorkout);
  const classes = useStyles();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    currentWorkoutContext.dispatch({
      type: 'OVERRIDE',
      value: arrayMove(currentWorkoutContext.state.sets, oldIndex, newIndex),
    });
  };

  const handleDelete = uuid => {
    currentWorkoutContext.dispatch({
      type: 'OVERRIDE',
      value: currentWorkoutContext.state.sets.filter(
        sets => sets.uuid !== uuid,
      ),
    });
  };

  const handleEdit = uuid => {
    onEdit(uuid);
  };

  const DragHandle = sortableHandle(() => {
    return (
      <ListItemIcon className={classes.reorderIcon}>
        <ReorderIcon color='primary' className={classes.reorderIcon} />
      </ListItemIcon>
    );
  });

  const getType = type => {
    switch (type) {
      case 'EXERCISE':
        return 'Timer';
      case 'EXERCISE_NO_TIMER':
        return 'Reps';
      case 'REST':
        return 'Rest Timer';
      default:
        return 'Timer';
    }
  };

  const SortableItem = sortableElement(({ index, value }) => {
    const { uuid, type, title, minutes, seconds, numberOfRepsNoTimer } = value;
    const newType = getType(type);
    return (
      <div className={classes.listItem}>
        <ListItem dense>
          <DragHandle />
          <ListItemText
            id={`item-${uuid}`}
            primary={<Typography variant='h6'>{`${title}`}</Typography>}
            secondary={
              <>
                <Typography
                  component='span'
                  variant='body2'
                  className={classes.inline}
                  color='textPrimary'
                >
                  {numberOfRepsNoTimer > 0
                    ? numberOfRepsNoTimer
                    : `${minutes < 10 ? '0' : ''}${minutes}:${
                        seconds < 10 ? '0' : ''
                      }${seconds}`}
                </Typography>
                <Typography component='span' variant='body2' edge='flex-end'>
                  {` - ${newType}`}
                </Typography>
              </>
            }
          />
          <ListItemSecondaryAction>
            <Tooltip title='Edit' enterDelay={400}>
              <IconButton
                onClick={() => handleEdit(uuid)}
                edge='start'
                aria-label='edit'
                color='primary'
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete' enterDelay={400}>
              <IconButton
                onClick={() => handleDelete(uuid)}
                edge='end'
                aria-label='delete'
                color='primary'
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    );
  });

  const SortableContainer = sortableContainer(({ children }) => {
    return <List className={classes.root}>{children}</List>;
  });

  return (
    <SortableContainer onSortEnd={onSortEnd} useDragHandle>
      {currentWorkoutContext.state &&
        currentWorkoutContext.state.sets.map((value, index) => (
          <SortableItem
            key={`item-${value.uuid}`}
            index={index}
            value={value}
          />
        ))}
    </SortableContainer>
  );
};

export default React.memo(ExerciseList);
