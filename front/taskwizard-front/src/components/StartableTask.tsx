import React, { useRef, useState, useEffect, SyntheticEvent, Dispatch, SetStateAction } from 'react';
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Progress, useToast, useMediaQuery, Flex, Box, Heading, useDisclosure, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Card, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TaskInterface } from '../../../../back/src/models/task';
import { formatTime } from '../utils/time';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteTask, stopTask, startTask } from '../utils/routing';
import store from '../redux/store';
import { useDispatch } from 'react-redux';
import { setStart } from '../redux/dashboardSlice';

const StartableTask = ({ task }: { task: TaskInterface }) => {
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [countAmount, setCountAmount] = useState(1);
  const [started, setStarted] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [timeLeft, setTimeLeft] = useState(task.timeLeftToday);
  const [totalTime, setTotalTime] = useState(task.totalTimeToday);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const toast = useToast();
  const startedRef = useRef(started);
  const handleCountChange = (amount: string) => {
    const amountNum = parseInt(amount);
    setCountAmount(amountNum);
  };
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
  useEffect(() => {
    let timer1: NodeJS.Timer;
    let timer2: NodeJS.Timer;
    if (started) {
      timer1 = setInterval(async () => {
        setTimeLeft((prevSeconds) => prevSeconds - 1);
        if (!overtime && timeLeft <= 1) {
          await stopTask(task.id);
          clearInterval(timer1);
          clearInterval(timer2);
          setStarted(false);
          setOvertime(true);
        }
      }, 1000);
      timer2 = setInterval(() => {
        setTotalTime((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => { clearInterval(timer1); clearInterval(timer2); };
  }, [started, timeLeft]);

  // This is a piece of shit hack because state cannot be changed in an event handler.
  function handleStartedStateChange (func: Dispatch<SetStateAction<boolean>>, value: boolean) {
    if (func) {
      func(value);
    }
  }

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        await stopTask(task.id);
        if (startedRef) {
          (await startTask(task.id));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleDeleteTask = async () => {
    dispatch(setStart(''));
    const res = await deleteTask(task.id);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    }
  };

  const dispatch = useDispatch();
  const handleTimedTask = async () => {
    if (!started) {
      const res = await startTask(task.id);
      if (res !== 'OK') {
        toast({
          title: res,
          status: 'error',
          isClosable: true
        });
      } else {
        dispatch(setStart(task.id));
        setStarted(!started);
      }
    } else {
      const res = await stopTask(task.id);
      if (res !== 'OK') {
        toast({
          title: res,
          status: 'error',
          isClosable: true
        });
      } else {
        dispatch(setStart(''));
        setStarted(!started);
      }
    }
  };
  const handleStopCountTask = async () => {
    const res = await stopTask(task.id, countAmount);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    }
  };
  return (
    <>
      <Card w={screenCutoff ? '400px' : '100%'} h='400px' justifyContent='center'>
        <Heading fontSize = 'xl' w= '80%' textAlign='center' position= 'absolute' top= '30px' left= '50%' transform= 'translate(-50%, -50%)'>{task.name}</Heading>
        <DeleteIcon onClick = {onOpen} cursor='pointer' position ='absolute' left = '90%' top = '20px'></DeleteIcon>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Confirm Deletion
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete task '{task.name}'?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={() => { onClose(); handleDeleteTask(); }} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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
          {
          !task.discrete
            ? <Button isDisabled = {((store.getState().dashboard.startedTask !== '') && (store.getState().dashboard.startedTask !== task.id))} onClick = {() => { handleTimedTask(); }}colorScheme={started ? 'green' : 'purple'} w='70%'>{started ? 'Stop' : 'Start'}</Button>
            : <Flex w = '70%' justifyContent='space-between'>
                <NumberInput onChange={handleCountChange} max={50} min={1} defaultValue={1} w = '47%'>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Button isDisabled = {((store.getState().dashboard.startedTask !== '') && (store.getState().dashboard.startedTask !== task.id))} onClick = {() => handleStopCountTask()} colorScheme='purple' w='47%'>Complete</Button>
              </Flex>
            }
        </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default StartableTask;
