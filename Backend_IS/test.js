const cru = require('./server/model/cru_model');
const { updateUser } = require('./server/controller/user_controller');

function test() {
  const testy = async () => {
    const result = await updateUser();
  };
  testy();
}
test();
