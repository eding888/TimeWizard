import React, { useRef, useState, useEffect, SyntheticEvent } from 'react';
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Progress, useToast, useMediaQuery, Flex, Box, Heading, useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Card, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TaskInterface } from '../../../../back/src/models/task';
import { formatTime } from '../utils/time';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteTask, stopTask, startTask } from '../utils/routing';
import store from '../redux/store';
import { useDispatch } from 'react-redux';
import { setStart } from '../redux/dashboardSlice';

const CurrentViewTask = ({ task }: { task: TaskInterface }) => {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [timeLeft, setTimeLeft] = useState(task.timeLeftToday);
  const [totalTime, setTotalTime] = useState(task.totalTimeToday);
  useEffect(() => {
    const firstStopTask = async () => {
      const res = await stopTask(task.id);
    };
    firstStopTask();
  }, []);
  useEffect(() => {
    console.log('x9');
    setTimeLeft(task.timeLeftToday);
    setTotalTime(task.totalTimeToday);
  }, [task]);

  console.log(store.getState().dashboard.startedTask);
  return (
    <>
      <Card w={screenCutoff ? '400px' : '100%'} h='400px' justifyContent='center'>
        <Heading fontSize = 'xl' w= '80%' textAlign='center' position= 'absolute' top= '30px' left= '50%' transform= 'translate(-50%, -50%)'>{task.name}</Heading>
        <Flex gap = '50px' flexDirection='column' justifyContent='center' height='100%'>
        <Flex mt = '10' direction = 'column' alignItems='center' justifyContent='center'>
        {
          task.deadlineOptions
            ? <>
                <Box>Deadline: {`${task.deadlineOptions.deadline.month}/${task.deadlineOptions.deadline.day}/${task.deadlineOptions.deadline.year}`}</Box>
                <Box>{task.discrete ? `Count Remaining: ${task.deadlineOptions.timeRemaining}` : `Time Remaining: ${formatTime(task.deadlineOptions.timeRemaining)}`}</Box>
              </>
            : <>
                <Box fontWeight='semibold'>{task.discrete ? `Count Allotted Per Week: ${task.recurringOptions.timePerWeek}` : `Time Allotted Per Week: ${formatTime(task.recurringOptions.timePerWeek)}`}</Box>
                <Box fontWeight='semibold' color='red'>{task.discrete ? `Count in Debt: ${task.recurringOptions.debt}` : `Time in Debt: ${formatTime(task.recurringOptions.debt)}`}</Box>
              </>
        }
        </Flex>
        <Flex gap = '10px' justifyContent='center' flexDirection='column' alignItems='center'>
          {
            task.timeLeftToday <= 0
              ? <Box fontSize='xl' color='lime'>Task Complete!</Box>
              : <></>
          }

          <Box mb = '-1' fontSize='m'>{task.timeLeftToday <= 0 ? 'Overtime Today' : (task.discrete ? 'Count Remaining Today' : 'Time Remaining Today')}</Box>
          {
            task.timeLeftToday <= 0
              ? <Box fontSize='xl' fontWeight='bold'>{task.discrete ? (task.totalTimeToday - task.originalTimeToday) : formatTime((totalTime - task.originalTimeToday))}</Box>
              : <Box fontSize='xl' fontWeight='bold'>{task.discrete ? task.timeLeftToday : formatTime(timeLeft)}</Box>
          }
          <Progress w='70%' mb = '3' borderRadius='lg' value={100 * (totalTime / (totalTime + timeLeft))}></Progress>
        </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default CurrentViewTask;
