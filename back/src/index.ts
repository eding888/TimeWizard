import app from './app.js';
import config from './utils/config.js';

const { PORT } = config;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
