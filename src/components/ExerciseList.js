import React, { useState, useContext } from 'react';
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

import { NewWorkoutContext } from '../pages/Xertimer';

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

const ExerciseList = () => {
  const currentWorkoutContext = useContext(NewWorkoutContext);

  console.log(currentWorkoutContext.state);
  const classes = useStyles();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    currentWorkoutContext.dispatch({
      type: 'ADJUST',
      value: arrayMove(currentWorkoutContext.state, oldIndex, newIndex),
    });
  };

  const handleDelete = uuid => {
    currentWorkoutContext.dispatch({
      type: 'ADJUST',
      value: currentWorkoutContext.state.filter(sets => sets.uuid !== uuid),
    });
  };

  const DragHandle = sortableHandle(() => {
    return (
      <ListItemIcon className={classes.reorderIcon}>
        <ReorderIcon className={classes.reorderIcon} />
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
            id={`item-${title}`}
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
            <Tooltip title='Edit'>
              <IconButton edge='start' aria-label='edit'>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                onClick={() => handleDelete(uuid)}
                edge='end'
                aria-label='delete'
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
      {currentWorkoutContext.state.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </SortableContainer>
  );
};

export default ExerciseList;
