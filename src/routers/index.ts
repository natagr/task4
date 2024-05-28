import express from 'express';
import ping from 'src/controllers/ping';

import sessions from './sessions';

const router = express.Router();

router.get('/ping', ping);

router.use('/api/session', sessions);

export default router;
