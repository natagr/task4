import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import routers from 'src/routers/sessions';
import Session from 'src/model/session';
import {ObjectId} from 'mongodb';

const {expect} = chai;
chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();
const app = express();
app.use(bodyParser.json({limit: '1mb'}));
app.use('/', routers);

describe('Session controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should list the sessions', (done) => {
    const sessions = [
      {
        _id: new ObjectId().toString(),
        courseId: 1,
        date: new Date('2023-05-28T10:00:00.000Z'),
        location: 'Location 1',
      },
      {
        _id: new ObjectId().toString(),
        courseId: 2,
        date: new Date('2023-05-29T14:00:00.000Z'),
        location: 'Location 2',
      },
    ];
    const findOneStub = sandbox.stub(Session, 'find');
    findOneStub.resolves(sessions);

    chai.request(app)
      .get('/sessions')
      .end((_err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(sessions);
        done();
      });
  });

  it('should save the session', (done) => {
    const sessionIdAfterSave = new ObjectId();
    const session = {
      courseId: 3,
      date: new Date('2023-05-30T16:00:00.000Z'),
      location: 'Location 3',
    };
    const saveOneStub = sandbox.stub(Session.prototype, 'save');
    saveOneStub.resolves({...session, _id: sessionIdAfterSave});

    chai.request(app)
      .post('/sessions')
      .send({body: {...session}})
      .end((_err, res) => {
        res.should.have.status(201);
        expect(res.body.id).to.equal(sessionIdAfterSave.toString());
        done();
      });
  });
});