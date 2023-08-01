import app from './app';
import config from './utils/config';
const { PORT } = config;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
