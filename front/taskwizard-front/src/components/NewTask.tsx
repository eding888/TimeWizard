import { Input, FormControl, FormLabel, NumberInput, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, NumberInputStepper, RadioGroup, Stack, Radio, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useState, SyntheticEvent, useEffect } from 'react';
import { updateNonNullChain } from 'typescript';

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
  type: Type | null
  deadlineDate: Date | null
}

const emptyData: TaskData = {
  completionType: null,
  type: null,
  deadlineDate: null
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
            <div>hi</div>
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
                    />
                    <Box mb='2' fontWeight='bold'>Estimated Time for Completion:</Box>
                    <Flex w = '100%' justifyContent='space-around'>
                      <FormControl w ='30%'>
                        <FormLabel>Hours</FormLabel>
                        <NumberInput max={999} min={0}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                      <FormControl w ='30%'>
                        <FormLabel>Minutes</FormLabel>
                        <NumberInput max={59} min={0}>
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
  const [timerTaskData, setTimerTaskData] = useState({});
  const [countIncomplete, setCountIncomplete] = useState(true);
  useEffect(() => {
    console.log(countTaskData);
    const desiredKeys: (keyof TaskData)[] = ['type', 'deadlineDate'];
    let includesAll = true;
    for (const key of desiredKeys) {
      if (!(key in countTaskData && countTaskData[key] !== null)) {
        includesAll = false;
      }
    }
    if (includesAll) {
      setCountIncomplete(false);
    }
  }, [countTaskData]);
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
                  <Button isDisabled = {countIncomplete} onClick = {() => { onClose(); submitTime(); }}>Submit</Button>
                </TabPanel>
                <TabPanel>
                  <Flex gap = '20px'>
                    <InfoIcon mt='1'></InfoIcon>
                    <Box fontSize='xs' mb ='4'>This task will be fufilled by doing something for a set amount of time (eg. studying with a goal of 7 hrs a week). </Box>
                  </Flex>
                  <DataPrompt stateMethod={setTimerTaskData}></DataPrompt>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default NewTask;
