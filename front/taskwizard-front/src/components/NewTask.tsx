import { RadioGroup, Stack, Radio, Image, Flex, Button, Heading, Box, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useState } from 'react';
enum CompletionType {
  COUNT,
  TIMER
}

enum Type {
  RECURRING,
  DEADLINE
}
interface TaskData {
  completionType: CompletionType | null,
  type: Type | null
}
const DataPrompt = ({ stateMethod }: {stateMethod: React.Dispatch<React.SetStateAction<any>>}) => {
  const currentData: TaskData = {
    completionType: null,
    type: null
  };

  const handleRadioChange = (nextValue: string) => {
    let type: Type;
    switch (nextValue) {
      case 'recurring':
        type = Type.RECURRING;
        break;
      case 'deadline':
        type = Type.DEADLINE;
        break;
      default:
        type = Type.RECURRING;
        break;
    }
    currentData.type = type;
    stateMethod(currentData);
  };
  return (
    <RadioGroup onChange={handleRadioChange}>
      <Stack direction='row'>
        <Radio value='recurring'>Recurring</Radio>
        <Radio value='deadline'>Deadline</Radio>
      </Stack>
    </RadioGroup>
  );
};
const NewTask = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) => {
  const [taskData, setTaskData] = useState({});
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
                    <Box fontSize='xs'>This task will be fufilled by completing a certain number of something (eg. doing practice problems with a goal of 50 a week). </Box>
                    <DataPrompt stateMethod={setTaskData}></DataPrompt>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex gap = '20px'>
                    <InfoIcon mt='1'></InfoIcon>
                    <Box fontSize='xs'>This task will be fufilled by doing something for a set amount of time (eg. studying with a goal of 7 hrs a week). </Box>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default NewTask;
