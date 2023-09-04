import React, { useEffect, useState } from 'react';
import '../index.css';
import { Progress, Skeleton, useMediaQuery, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import NavBar2 from '../components/NavBar2';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import NewTask from '../components/NewTask';
import VisitorViewTask from '../components/VisitorViewTask';
import CurrentViewTask from '../components/CurrentViewTask';
import { newSession, getFriendTasks, getFriendUser } from '../utils/routing';
import { TaskInterface } from '../../../../back/src/models/task';
import io from 'socket.io-client';
function VisitorDashboard () {
  const { username } = useParams();
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [allTasks, setAllTasks] = useState<TaskInterface[][]>([[], [], [], [], [], [], []]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const date = new Date();
  const today = date.getDay();
  const navigate = useNavigate();

  const sortTasks = async () => {
    if (!username) {
      return false;
    }
    const tasks: TaskInterface[] = await getFriendTasks(username);
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
    const socket = io('http://localhost:8081');
    socket.on('connect', async () => {
      console.log('Connected to server');
      if (username) {
        const user = await getFriendUser(username);
        console.log(user);
        if (!user.id) {
          navigate('/dashboard');
        }
        socket.emit('subscribeToUser', user.id);
      }
    });

    socket.on('taskChange', () => {
      sortTasks();
    });

    socket.on('userChange', async () => {
      sortTasks();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleLoad = () => {
    setIsNotLoaded(false);
  };
  const formatDate = (date: Date) => {
    if (!date) {
      return 'a';
    }
    return `${date.getMonth()}/${date.getDate()}`;
  };
  const renderViewTasks = (day: number) => {
    return allTasks[day].map(task => {
      return (
        <VisitorViewTask key={task.id} task={task}/>
      );
    });
  };
  const renderTodayViewTasks = (day: number) => {
    return allTasks[day].map(task => {
      return (
        <CurrentViewTask key={task.id} task={task}/>
      );
    });
  };
  return (
    <>
      <NavBar2/>
      <Flex mb = '5' justifyContent='center'>
        <Heading size='md'>
          Viewing {username}'s Dashboard
        </Heading>
      </Flex>
      <Tabs isFitted variant='enclosed' defaultIndex={today}>
        <TabList mb='1em'>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 0 ? 'bold' : 'normal'}>{screenCutoff ? 'Sunday' : 'Sun'} {formatDate(weekDates[0])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 2 ? 'bold' : 'normal'}>{screenCutoff ? 'Tuesday' : 'Tue'} {formatDate(weekDates[2])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 1 ? 'bold' : 'normal'}>{screenCutoff ? 'Monday' : 'Mon'} {formatDate(weekDates[1])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 3 ? 'bold' : 'normal'}>{screenCutoff ? 'Wednesday' : 'Wed'} {formatDate(weekDates[3])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 4 ? 'bold' : 'normal'}>{screenCutoff ? 'Thursday' : 'Thu'} {formatDate(weekDates[4])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 5 ? 'bold' : 'normal'}>{screenCutoff ? 'Friday' : 'Fri'} {formatDate(weekDates[5])}</Tab>
          <Tab fontSize={screenCutoff ? 'm' : 'xs'} fontWeight={today === 6 ? 'bold' : 'normal'}>{screenCutoff ? 'Saturday' : 'Sat'} {formatDate(weekDates[6])}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 0 ? renderTodayViewTasks(0) : renderViewTasks(0) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
          <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 1 ? renderTodayViewTasks(1) : renderViewTasks(1) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 2 ? renderTodayViewTasks(2) : renderViewTasks(2) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 3 ? renderTodayViewTasks(3) : renderViewTasks(3) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 4 ? renderTodayViewTasks(4) : renderViewTasks(4) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 5 ? renderTodayViewTasks(5) : renderViewTasks(5) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { today === 6 ? renderTodayViewTasks(6) : renderViewTasks(6) }
              </Flex>
            </Skeleton>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default VisitorDashboard;
