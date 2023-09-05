import React, { useEffect, useState } from 'react';
import '../index.css';
import { Progress, Skeleton, useMediaQuery, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import NavBar2 from '../components/NavBar2';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import NewTask from '../components/NewTask';
import ViewTask from '../components/ViewTask';
import StartableTask from '../components/StartableTask';
import { newSession, getTasks, getCurrentUser } from '../utils/routing';
import { TaskInterface } from '../../../../back/src/models/task';
import { FriendsData } from '../../../../back/src/models/user';
import FriendsList from '../components/FriendsList';
import io from 'socket.io-client';
function Dashboard () {
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [allTasks, setAllTasks] = useState<TaskInterface[][]>([[], [], [], [], [], [], []]);
  const [friendsData, setFriendsData] = useState<FriendsData>({ friends: [], friendRequests: [] });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const date = new Date();
  const today = date.getDay();
  const navigate = useNavigate();

  const sortTasks = async () => {
    const tasks: TaskInterface[] = await getTasks();
    if (typeof tasks === 'string') {
      return false;
    }
    const taskEachDay: TaskInterface[][] = [[], [], [], [], [], [], []];
    tasks.forEach(task => {
      const days: number[] = task.daysOfWeek;
      days.forEach(day => {
        taskEachDay[day].push(task);
      });
    });
    setAllTasks(taskEachDay);
    setLoaded(true);
    if (taskEachDay[today].length !== 0) {
      let completedTime = 0;
      let remainingTime = 0;
      taskEachDay[today].map(task => {
        let mult = 1;
        if (task.discrete) {
          mult = 60;
        }
        completedTime += Math.min(task.totalTimeToday, task.originalTimeToday) * mult;
        remainingTime += task.timeLeftToday * mult;
        return true;
      });
      setProgress(completedTime / (completedTime + remainingTime));
    } else {
      setProgress(0);
    }
  };

  const setFriendData = async () => {
    const res = await getCurrentUser();
    setFriendsData(res.friendsData);
  };

  useEffect(() => {
    const checkSession = async () => {
      const res = await newSession();
      if (res !== 'OK') {
        window.localStorage.setItem('logged', 'false');
        navigate('/');
      }
    };

    const fetch = async () => {
      await checkSession();
      await sortTasks();
      await setFriendData();
    };
    fetch();

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    setWeekDates(dates);
  }, []);
  useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('subscribeToUser', window.localStorage.getItem('loggedUser'));
    });

    socket.on('taskChange', () => {
      sortTasks();
    });

    socket.on('userChange', async () => {
      sortTasks();
      await setFriendData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const formatDate = (date: Date) => {
    if (!date) {
      return 'a';
    }
    return `${date.getMonth()}/${date.getDate()}`;
  };
  const renderViewTasks = (day: number) => {
    return allTasks[day].map(task => {
      return (
        <ViewTask key={task.id} task={task}/>
      );
    });
  };
  const renderStartableTasks = (day: number) => {
    return allTasks[day].map(task => {
      return (
        <StartableTask key={task.id} task={task}/>
      );
    });
  };
  const { isOpen: isOpenNewTask, onOpen: onOpenNewTask, onClose: onCloseNewTask } = useDisclosure();
  const { isOpen: isOpenFriendsList, onOpen: onOpenFriendsList, onClose: onCloseFriendsList } = useDisclosure();
  return (
    <>
      <NavBar2/>
      <Flex justifyContent='center' alignItems='center' gap = {screenCutoff ? '50px' : '0px'} direction = {screenCutoff ? 'row' : 'column'} mb='3'>
        <Flex justifyContent='center' gap='30px' mb = '5'>
          <Button colorScheme = 'purple' onClick={onOpenNewTask}><AddIcon mr ='3'></AddIcon>New Task</Button>
          <Button animation= {friendsData.friendRequests.length === 0 ? '' : 'newFriendRequests 2.5s ease-in-out infinite'} onClick={onOpenFriendsList}><HamburgerIcon mr ='3'></HamburgerIcon>View Friends</Button>
        </Flex>
        <Flex justifyContent='center' alignItems='center' direction='column' gap='30px' mb = '5'>
          <Heading fontSize = 'xl' mb ='-3'>Today's Progress:</Heading>
          <Progress w='300px' colorScheme='teal' borderRadius='lg' value={100 * progress}></Progress>
        </Flex>
      </Flex>
      <NewTask isOpen={isOpenNewTask} onClose= {onCloseNewTask}></NewTask>
      <FriendsList isOpen={isOpenFriendsList} onClose = {onCloseFriendsList} friendsData={friendsData}/>
      <Tabs isFitted variant='enclosed' defaultIndex={today}>
        <TabList mb='1em'>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 0 ? 'bold' : 'normal'}>{screenCutoff ? 'Sunday' : 'Sun'} {formatDate(weekDates[0])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 1 ? 'bold' : 'normal'}>{screenCutoff ? 'Monday' : 'Mon'} {formatDate(weekDates[1])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 2 ? 'bold' : 'normal'}>{screenCutoff ? 'Tuesday' : 'Tue'} {formatDate(weekDates[2])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 3 ? 'bold' : 'normal'}>{screenCutoff ? 'Wednesday' : 'Wed'} {formatDate(weekDates[3])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 4 ? 'bold' : 'normal'}>{screenCutoff ? 'Thursday' : 'Thu'} {formatDate(weekDates[4])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 5 ? 'bold' : 'normal'}>{screenCutoff ? 'Friday' : 'Fri'} {formatDate(weekDates[5])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 6 ? 'bold' : 'normal'}>{screenCutoff ? 'Saturday' : 'Sat'} {formatDate(weekDates[6])}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 0 ? renderStartableTasks(0) : renderViewTasks(0) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
          <Skeleton isLoaded={loaded} h={screenCutoff ? '65vh' : '60vh'} overflow='auto' w = '100%'>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 1 ? renderStartableTasks(1) : renderViewTasks(1) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 2 ? renderStartableTasks(2) : renderViewTasks(2) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 3 ? renderStartableTasks(3) : renderViewTasks(3) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 4 ? renderStartableTasks(4) : renderViewTasks(4) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 5 ? renderStartableTasks(5) : renderViewTasks(5) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 6 ? renderStartableTasks(6) : renderViewTasks(6) }
              </Flex>
            </Skeleton>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Dashboard;
