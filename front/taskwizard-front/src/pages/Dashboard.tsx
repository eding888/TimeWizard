import React, { useEffect, useState } from 'react';
import '../index.css';
import { Skeleton, useMediaQuery, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import NavBar2 from '../components/NavBar2';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import SignupButton from '../components/SignupButton';
import { checkToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import NewTask from '../components/NewTask';
import ViewTask from '../components/ViewTask';
import { newSession, getTasks, getCurrentUser } from '../utils/routing';
import { TaskInterface } from '../../../../back/src/models/task';
import io from 'socket.io-client';
function Dashboard () {
  const [isNotLoaded, setIsNotLoaded] = useState(true);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [screenCutoff] = useMediaQuery('(min-width: 600px)');
  const [allTasks, setAllTasks] = useState<TaskInterface[][]>([[], [], [], [], [], [], []]);
  const [loaded, setLoaded] = useState(false);
  const date = new Date();
  const today = date.getDay();
  const navigate = useNavigate();
  useEffect(() => {
    console.log('hi');
    const checkSession = async () => {
      const res = await newSession();
      if (res !== 'OK') {
        window.localStorage.setItem('logged', 'false');
        navigate('/');
      }
    };
    const sortTasks = async () => {
      const tasks: TaskInterface[] = await getTasks();
      console.log(tasks);
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
    const getCurrentUserId = async () => {
      const res = await getCurrentUser();
      return res;
    };
    const socket = io('http://localhost:8081');
    getCurrentUserId();
    socket.on('connect', () => {
      console.log('Connected to server');
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
  const renderTasks = (day: number) => {
    return allTasks[day].map(task => {
      return (
        <ViewTask task={task}/>
      );
    });
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <NavBar2/>
      <Flex justifyContent='center' gap='30px' mb = '5'>
      <Button colorScheme = 'purple' onClick={onOpen}><AddIcon mr ='3'></AddIcon>New Task</Button>
      <Button onClick={onOpen}><HamburgerIcon mr ='3'></HamburgerIcon>View Friends</Button>
      </Flex>
      <NewTask isOpen={isOpen} onClose= {onClose}></NewTask>
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
            <Skeleton>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(0) }
              </Flex>
            </Skeleton>
            </Skeleton>
          </TabPanel>
          <TabPanel>
          <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(1) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(2) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(3) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(4) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(5) }
              </Flex>
            </Skeleton>
          </TabPanel>
          <TabPanel>
            <Skeleton isLoaded={loaded}>
              <Flex gap='30px' flexWrap='wrap' justifyContent='center' w='100%'>
                { renderTasks(6) }
              </Flex>
            </Skeleton>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Dashboard;
