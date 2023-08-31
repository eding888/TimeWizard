import { useToast, Checkbox, Input, FormControl, FormLabel, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, NumberInputStepper, RadioGroup, Stack, Radio, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useState, SyntheticEvent, useEffect } from 'react';
import { newTask } from '../utils/routing';
import { current } from '@reduxjs/toolkit';
export enum CompletionType {
  COUNT,
  TIMER
}

export enum Type {
  RECURRING,
  DEADLINE,
  NONE
}
export interface TaskData {
  completionType: CompletionType | null,
  type: Type | null,
  deadlineDate: Date | null,
  hours: number | null,
  minutes: number | null,
  selectedDays: number[] | null,
  name: string | null
}

const emptyData: TaskData = {
  completionType: null,
  type: null,
  deadlineDate: null,
  hours: 0,
  minutes: null,
  selectedDays: null,
  name: null
};
const DataPrompt = ({ stateMethod, completionType }: {stateMethod: React.Dispatch<React.SetStateAction<any>>, completionType: CompletionType}) => {
  const [currentData, setCurrentData] = useState(emptyData);
  const [checkedTask, setCheckedTask] = useState(Type.NONE);

  const handleRadioChange = (nextValue: string) => {
    let type: Type;
    switch (nextValue) {
      case 'recurring':
        type = Type.RECURRING;
        setCheckedTask(Type.RECURRING);
        break;
      case 'deadline':
        type = Type.DEADLINE;
        setCheckedTask(Type.DEADLINE);
        break;
      default:
        type = Type.RECURRING;
        break;
    }
    const newData = { ...currentData };
    newData.type = type;
    setCurrentData(newData);
    stateMethod(newData);
  };

  const handleDate = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const date = new Date(target.value);
    date.setDate(date.getDate() + 1);
    const newData = { ...currentData };
    newData.deadlineDate = date;
    setCurrentData(newData);
    stateMethod(newData);
  };

  const handleTimeHours = (newValue: string): void => {
    let hours: number | null = parseInt(newValue);
    if (!hours) {
      hours = 0;
    }
    if (hours === 0 && currentData.minutes === 0) {
      hours = null;
    }
    const newData = { ...currentData };
    if (!currentData.minutes && hours !== 0) {
      newData.minutes = 0;
    }
    newData.hours = hours;
    setCurrentData(newData);
    stateMethod(newData);
  };

  const handleTimeMinutes = (newValue: string): void => {
    let minutes: number | null = parseInt(newValue);
    if (!minutes) {
      minutes = 0;
    }
    if (minutes === 0 && currentData.hours === 0) {
      minutes = null;
    }
    const newData = { ...currentData };
    newData.minutes = minutes;
    setCurrentData(newData);
    stateMethod(newData);
  };

  const handleCount = (newValue: string): void => {
    let count: number | null = parseInt(newValue);
    if (!count) {
      count = 0;
    }
    if (count === 0 && currentData.hours === 0) {
      count = null;
    }
    const newData = { ...currentData };
    newData.minutes = !count ? null : (count / 60);
    setCurrentData(newData);
    stateMethod(newData);
  };

  const daysOfWeek = [
    { id: 0, name: 'Sun' },
    { id: 1, name: 'Mon' },
    { id: 2, name: 'Tue' },
    { id: 3, name: 'Wed' },
    { id: 4, name: 'Thu' },
    { id: 5, name: 'Fri' },
    { id: 6, name: 'Sat' }
  ];

  const handleName = (event: SyntheticEvent): void => {
    const target = event.target as HTMLInputElement;
    const name = target.value;
    const newData = { ...currentData };
    console.log(newData);
    newData.name = name.length === 0 ? null : name;
    setCurrentData(newData);
    stateMethod(newData);
  };

  const toggleDay = (dayId: number) => {
    const newData = { ...currentData };
    if (!currentData.selectedDays) {
      const newDays = [];
      newDays.push(dayId);
      newData.selectedDays = newDays;
      setCurrentData(newData);
      stateMethod(newData);
    } else {
      let newDays: number[] | null = [...currentData.selectedDays];
      if (newDays.includes(dayId)) {
        newDays = newDays.filter(id => id !== dayId);
        if (newDays.length === 0) {
          newDays = null;
        }
      } else {
        newDays.push(dayId);
      }
      newData.selectedDays = newDays;
      setCurrentData(newData);
      stateMethod(newData);
    }
  };

  const today = new Date().toISOString().substr(0, 10);
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const maxDate = oneYearFromNow.toISOString().substr(0, 10);
  return (
    <>
      <Box mb='2' fontWeight='bold'>Task Name:</Box>
      <Input type='text' maxLength={24} onChange ={handleName} mb ='2'></Input>
      <Box mb='2' fontWeight='bold'>Days of Week:</Box>
      <Flex mb = '5' justifyContent='space-evenly'>
      {daysOfWeek.map(day => {
        return (
          <Flex direction='column' alignItems='center'>
            <Box fontSize ='xs'>{day.name}</Box>
            <Checkbox key={day.id} onChange={() => toggleDay(day.id)} isChecked = {!currentData.selectedDays ? false : currentData.selectedDays.includes(day.id)}></Checkbox>
          </Flex>
        );
      })}
      </Flex>
      <RadioGroup onChange={handleRadioChange} mb = '5'>
        <Stack direction='row'>
          <Radio value='recurring'>Recurring</Radio>
          <Radio value='deadline'>Deadline</Radio>
        </Stack>
      </RadioGroup>
      <Box>
        {
          completionType === CompletionType.TIMER
            ? (checkedTask === Type.RECURRING)
                ? (
              <>
                <Box mb='2' fontWeight='bold'>Desired Time Per Week:</Box>
                  <Flex w = '100%' justifyContent='space-around'>
                    <FormControl w ='30%'>
                      <FormLabel>Hours</FormLabel>
                      <NumberInput onChange={handleTimeHours} max={150} min={0} defaultValue={!currentData.hours ? 0 : currentData.hours}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl w ='30%'>
                      <FormLabel>Minutes</FormLabel>
                      <NumberInput onChange={handleTimeMinutes} max={59} min={0} defaultValue={!currentData.minutes ? 0 : currentData.minutes}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Flex>
                </>
                  )
                : (
                    (checkedTask === Type.DEADLINE)
                      ? (
                    <>
                      <Box mb='2' fontWeight='bold'>Deadline:</Box>
                      <Input
                        mb ='5'
                        placeholder="Select Date"
                        size="md"
                        type="date"
                        onChange={handleDate}
                        min = {today}
                        max = {maxDate}
                      />
                      <Box mb='2' fontWeight='bold'>Estimated Time for Completion:</Box>
                      <Flex w = '100%' justifyContent='space-around'>
                        <FormControl w ='30%'>
                          <FormLabel>Hours</FormLabel>
                          <NumberInput onChange={handleTimeHours} max={999} min={0} defaultValue={!currentData.hours ? 0 : currentData.hours}>
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        <FormControl w ='30%'>
                          <FormLabel>Minutes</FormLabel>
                          <NumberInput onChange={handleTimeMinutes} max={59} min={0} defaultValue={!currentData.minutes ? 0 : currentData.minutes}>
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </Flex>
                    </>
                        )
                      : (
                          <div></div>
                        )
                  )
            : checkedTask === Type.RECURRING
              ? <>
                  <Box mb='2' fontWeight='bold'>Count: </Box>
                  <FormControl w ='30%'>
                    <NumberInput onChange={handleCount} max={99999} min={0} defaultValue={!currentData.minutes ? 0 : currentData.minutes * 60}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </>
              : checkedTask === Type.DEADLINE
                ? <>
                    <Input
                      mb ='5'
                      placeholder="Select Date"
                      size="md"
                      type="date"
                      onChange={handleDate}
                      min = {today}
                      max = {maxDate}
                    />
                    <Box mb='2' fontWeight='bold'>Count: </Box>
                    <FormControl w ='30%'>
                      <NumberInput onChange={handleCount} max={99999} min={0} defaultValue={!currentData.minutes ? 0 : currentData.minutes * 60}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </>
                : <></>
            }
      </Box>
    </>
  );
};
const countDays = (daysOfWeek: number[], endDate: Date) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = endDate;

  let count = 0;
  const currentDate = new Date(start);
  while (currentDate <= end) { //eslint-disable-line
    if (daysOfWeek.includes(currentDate.getDay())) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};
const NewTask = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) => {
  const [countTaskData, setCountTaskData] = useState(emptyData);
  const [timerTaskData, setTimerTaskData] = useState(emptyData);
  const [countIncomplete, setCountIncomplete] = useState(true);
  const [timerIncomplete, setTimerIncomplete] = useState(true);
  const checkData = (taskData: TaskData): boolean => {
    const deadlineKeys: (keyof TaskData)[] = ['hours', 'minutes', 'deadlineDate', 'name', 'selectedDays'];
    const recurringKeys: (keyof TaskData)[] = ['hours', 'minutes', 'name', 'selectedDays'];
    if ('type' in taskData) {
      if (taskData.type === Type.DEADLINE) {
        const date = taskData.deadlineDate;
        if (taskData.selectedDays !== null && date !== null && countDays(taskData.selectedDays, date) === 0) {
          return false;
        }
        for (const key of deadlineKeys) {
          if (!(key in taskData && taskData[key] !== null)) {
            return false;
          }
        }
      } else if (taskData.type === Type.RECURRING) {
        for (const key of recurringKeys) {
          if (!(key in taskData && taskData[key] !== null)) {
            return false;
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (checkData(countTaskData)) {
      setCountIncomplete(false);
    } else {
      setCountIncomplete(true);
    }
  }, [countTaskData]);
  useEffect(() => {
    if (checkData(timerTaskData)) {
      setTimerIncomplete(false);
    } else {
      setTimerIncomplete(true);
    }
  }, [timerTaskData]);
  const toast = useToast();
  const createNewTask = async (data: TaskData, completionType: CompletionType) => {
    console.log('hi');
    console.log(data);
    if (data.type === null || data.name === null || !data.selectedDays || data.hours === null || data.minutes === null) {
      return false;
    }
    const res = await newTask(data.type, data.name, completionType, data.selectedDays, data.deadlineDate, data.hours, data.minutes);
    if (res !== 'OK') {
      toast({
        title: res,
        status: 'error',
        isClosable: true
      });
    } else {
      console.log('poop');
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>Count</Tab>
                <Tab>Timer</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Flex gap = '20px'>
                    <InfoIcon mt='1'></InfoIcon>
                    <Box fontSize='xs' mb ='4'>This task will be fufilled by completing a certain number of something (eg. doing practice problems with a goal of 50 a week). </Box>
                  </Flex>
                  <DataPrompt completionType = {CompletionType.COUNT} stateMethod={setCountTaskData}></DataPrompt>
                  <Button mt='5' w='100%' colorScheme='purple' isDisabled = {countIncomplete} onClick = {async () => { await createNewTask(countTaskData, CompletionType.COUNT); onClose(); }}>Submit</Button>
                </TabPanel>
                <TabPanel>
                  <Flex gap = '20px'>
                    <InfoIcon mt='1'></InfoIcon>
                    <Box fontSize='xs' mb ='4'>This task will be fufilled by doing something for a set amount of time (eg. studying with a goal of 7 hrs a week). </Box>
                  </Flex>
                  <DataPrompt completionType = {CompletionType.TIMER} stateMethod={setTimerTaskData}></DataPrompt>
                  <Button mt='5' w='100%' colorScheme='purple' isDisabled = {timerIncomplete} onClick = {async () => { await createNewTask(timerTaskData, CompletionType.TIMER); onClose(); }}>Submit</Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default NewTask;
