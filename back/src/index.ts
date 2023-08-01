import app from './app.ts';
import config from './utils/config.ts';

const { PORT } = config;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
