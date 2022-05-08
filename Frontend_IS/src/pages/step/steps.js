import { Steps, Hints } from 'intro.js-react';
import { useState } from 'react';
import { Button } from '@mui/material';

const StepChatroom = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    steps: [
      {
        element: '#play_btn',
        intro: "Click 'Play' to enjoy the show",
      },
      {
        element: '#episode_choice_des',
        intro: 'Descriptions about the show',
      },
      {
        element: '#more_des_btn',
        intro: 'Show more information about the show',
      },
      {
        element: '#msg',
        intro: 'Sign in to leave your message here',
      },
      {
        element: '#send_msg',
        intro: "Click 'Send' to share your thoughts",
      },
      {
        element: '#chatroom',
        intro: 'Please enjoy the interactive chatroom',
      },
    ],
    hintsEnabled: false,
    hints: [
      {
        element: '.hello',
        hint: 'Hello hint',
        hintPosition: 'middle-right',
      },
    ],
  };

  const onExit = () => {
    setIntro(false);
  };
  const guider = () => {
    setIntro(true);
    console.log('state.stepsEnabled', state.stepsEnabled);
  };
  return (
    <>
      <Button onClick={guider} id='helper'>
        GUIDE
      </Button>
      <Steps
        enabled={state.stepsEnabled}
        steps={state.steps}
        initialStep={state.initialStep}
        onExit={onExit}
      />
      <Hints enabled={state.hintsEnabled} hints={state.hints} />
    </>
  );
};
const Step = { StepChatroom };
export default Step;
