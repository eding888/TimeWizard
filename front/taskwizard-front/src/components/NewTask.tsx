import { Input, FormControl, FormLabel, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, NumberInputStepper, RadioGroup, Stack, Radio, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useState, SyntheticEvent, useEffect } from 'react';

enum CompletionType {
  COUNT,
  TIMER
}

enum Type {
  RECURRING,
  DEADLINE,
  NONE
}
interface TaskData {
  completionType: CompletionType | null,
  type: Type | null,
  deadlineDate: Date | null,
  hours: number | null,
  minutes: number | null
}

const emptyData: TaskData = {
  completionType: null,
  type: null,
  deadlineDate: null,
  hours: 0,
  minutes: null
};
const DataPrompt = ({ stateMethod }: {stateMethod: React.Dispatch<React.SetStateAction<any>>}) => {
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

  const today = new Date().toISOString().substr(0, 10);
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const maxDate = oneYearFromNow.toISOString().substr(0, 10);
  return (
    <>
      <RadioGroup onChange={handleRadioChange} mb = '5'>
        <Stack direction='row'>
          <Radio value='recurring'>Recurring</Radio>
          <Radio value='deadline'>Deadline</Radio>
        </Stack>
      </RadioGroup>
      <Box>
        {(checkedTask === Type.RECURRING)
          ? (
            <>
              <Box mb='2' fontWeight='bold'>Desired time per week:</Box>
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
            )}
      </Box>
    </>
  );
};
const NewTask = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) => {
  const [countTaskData, setCountTaskData] = useState(emptyData);
  const [timerTaskData, setTimerTaskData] = useState(emptyData);
  const [countIncomplete, setCountIncomplete] = useState(true);
  const [timerIncomplete, setTimerIncomplete] = useState(true);
  const checkData = (taskData: TaskData): boolean => {
    const deadlineKeys: (keyof TaskData)[] = ['hours', 'minutes', 'deadlineDate'];
    const recurringKeys: (keyof TaskData)[] = ['hours', 'minutes'];

    if ('type' in taskData) {
      if (taskData.type === Type.DEADLINE) {
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
    console.log(countTaskData);
    if (checkData(countTaskData)) {
      setCountIncomplete(false);
    } else {
      setCountIncomplete(true);
    }
  }, [countTaskData]);
  useEffect(() => {
    console.log(timerTaskData);
    if (checkData(timerTaskData)) {
      setTimerIncomplete(false);
    } else {
      setTimerIncomplete(true);
    }
  }, [timerTaskData]);
  const submitTime = () => {
    console.log('as');
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
                  <DataPrompt stateMethod={setCountTaskData}></DataPrompt>
                  <Button mt='5' w='100%' colorScheme='purple' isDisabled = {countIncomplete} onClick = {() => { onClose(); submitTime(); }}>Submit</Button>
                </TabPanel>
                <TabPanel>
                  <Flex gap = '20px'>
                    <InfoIcon mt='1'></InfoIcon>
                    <Box fontSize='xs' mb ='4'>This task will be fufilled by doing something for a set amount of time (eg. studying with a goal of 7 hrs a week). </Box>
                  </Flex>
                  <DataPrompt stateMethod={setTimerTaskData}></DataPrompt>
                  <Button mt='5' w='100%' colorScheme='purple' isDisabled = {timerIncomplete} onClick = {() => { onClose(); submitTime(); }}>Submit</Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default NewTask;
