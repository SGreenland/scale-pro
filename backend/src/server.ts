import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('API is running...');
});
