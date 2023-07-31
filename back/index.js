import app from './src/app.js';
import config from './src/utils/config.js';

const { PORT } = config;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
