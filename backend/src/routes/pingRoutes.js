import express from 'express';
import { pingHandler } from '../controller/controllerPing.js';

const router = express.Router();

router.get('/ping', pingHandler);

export default router;
