import chai from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import {ObjectId} from 'mongodb';
import {SessionSaveDto} from 'src/dto/session/SessionSaveDto';
import * as sessionService from 'src/services/session';
import Session from "../../model/session";

const {expect} = chai;
const sandbox = sinon.createSandbox();

const session1 = new Session({
  _id: new ObjectId(),
  location: 'Location 1',
  date: new Date('2023-05-01'),
  courseId: '1',
});

const session2 = new Session({
  _id: new ObjectId(),
  location: 'Location 2',
  date: new Date('2023-05-15'),
  courseId: '2',
});

const session3 = new Session({
  _id: new ObjectId(),
  location: 'Location 3',
  date: new Date('2023-06-01'),
  courseId: '2',
});

describe('Session Service', () => {
  before(async () => {
    await session1.save();
    await session2.save();
    await session3.save();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('listSessions should return all sessions', async () => {
    const sessions = await sessionService.listSessions();
    expect(sessions.length).to.equal(3);
  });

  it('saveSession should create a new session', async () => {
    const axiosGetStub = sandbox.stub(axios, 'get').resolves({status: 200, data: true});
    const sessionSaveDto: SessionSaveDto = {
      location: 'New Location',
      date: new Date('2023-07-01'),
      courseId: 3,
    };
    const sessionId = await sessionService.saveSession(sessionSaveDto);
    expect(sessionId).to.be.a('string');
    expect(axiosGetStub.calledOnceWith(`http://localhost:8080/api/course/${sessionSaveDto.courseId}`)).to.be.true;
    const session = await Session.findById(sessionId);
    expect(session).to.exist;
    expect(session?.location).to.equal(sessionSaveDto.location);
    expect(session?.date).to.eql(sessionSaveDto.date);
    expect(session?.courseId).to.equal(sessionSaveDto.courseId.toString());
  });

  it('listSessionsByCourseId should return sessions for a given courseId', async () => {
    const sessions = await sessionService.listSessionsByCourseId(2);
    expect(sessions.length).to.equal(2);
    expect(sessions.map(s => s._id)).to.include(session2._id.toString(), session3._id.toString());
  });

  it('countSessionsByCourseIds should return correct session counts', async () => {
    const counts = await sessionService.countSessionsByCourseIds([1, 2]);
    expect(counts[1]).to.equal(1);
    expect(counts[2]).to.equal(2);
  });
});