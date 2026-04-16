import express from 'express';
const app = express();
app.use(express.json());
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/', (req, res) => {
    res.send('Hello from TypeScript Backend');
});
export default app;
