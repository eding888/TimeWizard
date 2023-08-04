import express from 'express';
// THIS ROUTER USED FOR UNIT TESTS
const testRouter = express.Router();
testRouter.get('/', async (request, response) => {
    const message = 'hej';
    response.status(200).json(message);
});
export default testRouter;
