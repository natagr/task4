import axios from 'axios';
import {SessionDto} from "../../dto/session/sessionDto";
import {SessionSaveDto} from "../../dto/session/SessionSaveDto";
import Session, {ISession} from "../../model/session";

export const listSessions = async (): Promise<SessionDto[]> => {
  const sessions = await Session.find({});
  return sessions.map(session => toSessionDto(session));
};

export const saveSession = async ({location, date, courseId}: SessionSaveDto): Promise<string> => {
  try {
    const response = await axios.get(`http://localhost:8080/api/course/${courseId}`);

    if (response.status === 200 && response.data) {
      const session = await new Session({
        location,
        date,
        courseId: courseId.toString(),
      }).save();
      return session._id;
    } else {
      throw new Error('Course not found');
    }
  } catch (error) {
    throw new Error('Error checking Course existence');
  }
};

export const listSessionsByCourseId = async (courseId: number, size = 10, from = 0): Promise<SessionDto[]> => {
  const sessions = await Session.find({courseId})
    .sort({date: -1})
    .skip(from)
    .limit(size);
  return sessions.map(session => toSessionDto(session));
};

export const countSessionsByCourseIds = async (courseIds: number[]): Promise<Record<number, number>> => {
  const counts = await Session.aggregate([
    {$match: {courseId: {$in: courseIds}}},
    {$group: {_id: "$courseId", count: {$sum: 1}}},
  ]);

  const result: Record<number, number> = {};
  courseIds.forEach(courseId => {
    const count = counts.find(c => c._id === courseId);
    result[courseId] = count ? count.count : 0;
  });

  return result;
};

const toSessionDto = (session: ISession): SessionDto => ({
  _id: session._id,
  date: session.date,
  location: session.location,
  courseId: Number(session.courseId),
});
