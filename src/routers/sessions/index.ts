import express from 'express';
import {countSessionsByCourseIds, listSessionsByCourseId, saveSession} from "../../controllers/sessions";

const router = express.Router();

router.post('', saveSession);
router.get('', listSessionsByCourseId);
router.post('/_count', countSessionsByCourseIds);

export default router;

