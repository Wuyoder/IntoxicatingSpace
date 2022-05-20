require('dotenv');
const { expect, requester } = require('./setup');

describe('chathistory', async () => {
  it('get chathistory check - no message', async () => {
    const res = await requester
      .post('/api/1.0/user/chathistory')
      .send({ show_id: 'show_id', episode_id: 'episode_id' });
    expect(res.statusCode).to.equal(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].chat_msg).to.equal(
      'NO MESSSAGE HERE, PLEASE LEAVE YOUR WORDS.'
    );
  });

  // it('get chathistory check - test msg ', async () => {
  //   const res = await requester
  //     .post('/api/1.0/user/chathistory')
  //     .send({ show_id: 1, episode_id: 'test' });
  //   console.log('res_situ2', res.body);
  //   //console.log('msg', res.body[2].chat_msg);
  //   expect(res.statusCode).to.equal(200);
  //   expect(res.body.length).to.equal(3);
  //   expect(res.body[2].chat_msg).to.equal('test-mag-3');
  // });
});
