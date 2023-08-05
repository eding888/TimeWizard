import express from 'express';
// THIS ROUTER USED FOR UNIT TESTS
const testRouter = express.Router();
testRouter.get('/', async (request, response) => {
    if (!request.user?.isVerified) {
        return response.status(401).json({
            error: 'user is not verified'
        });
    }
    const message = 'hej';
    response.status(200).json(message);
});
export default testRouter;
