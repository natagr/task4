import log4js from 'log4js';
import httpStatus from 'http-status';
import {Request, Response} from 'express';
import {
  saveSession as saveSessionApi,
  listSessionsByCourseId as listByCourseIds,
  countSessionsByCourseIds as countByCourseIds,
} from 'src/services/session';
import {SessionSaveDto} from 'src/dto/session/SessionSaveDto';
import {InternalError} from "../../system/internalError";

export const listSessionsByCourseId = async (req: Request, res: Response): Promise<void> => {
  const courseId = parseInt(req.query.courseId as string, 10);
  const size = parseInt(req.query.size as string) || 10;
  const from = parseInt(req.query.from as string) || 0;

  if (isNaN(courseId)) {
    res.status(httpStatus.BAD_REQUEST).send({message: 'Invalid or missing courseId'});
    return;
  }

  try {
    const sessions = await listByCourseIds(courseId, size, from);
    res.send(sessions);
  } catch (err) {
    log4js.getLogger().error('Error in retrieving sessions by courseId.', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({message: 'Internal server error'});
  }
};

export const countSessionsByCourseIds = async (req: Request, res: Response): Promise<void> => {
  const {entity1Ids} = req.body;
  const courseIds = entity1Ids.map((id: string) => parseInt(id, 10)).filter((id: number) => !isNaN(id));

  if (!Array.isArray(courseIds) || courseIds.some(id => isNaN(id))) {
    res.status(httpStatus.BAD_REQUEST).send({message: 'Invalid CourseIds'});
    return;
  }

  try {
    const counts = await countByCourseIds(courseIds);
    res.send(counts);
  } catch (err) {
    log4js.getLogger().error('Error in counting sessions by courseIds.', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({message: 'Internal server error'});
  }
};

export const saveSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      location,
      date,
      courseId,
    } = new SessionSaveDto(
      req.body
    );

    if (isNaN(courseId)) {
      res.status(httpStatus.BAD_REQUEST).send({message: 'Invalid courseId'});
      return;
    }

    const id = await saveSessionApi({
      location,
      date,
      courseId,
    });

    res.status(httpStatus.CREATED).send({id});
  } catch (err) {
    const {message, status} = new InternalError(err);
    log4js.getLogger().error('Error in creating session.', err);
    res.status(status).send({message});
  }
};


