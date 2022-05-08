import { Steps, Hints } from 'intro.js-react';
import { useState } from 'react';

const StepChatroom = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#play_btn',

        intro: "Click 'Play' to enjoy the show!",
      },
      {
        element: '#episode_choice_des',
        intro: 'Description of the show.',
      },
      {
        element: '#more_des_btn',
        intro: 'Show more description.',
      },

      {
        element: '#chatroom',
        intro: 'Please sign in to share your thoughts.',
      },
      {
        intro: '♡❤♡❤♡❤♡❤♡❤Now it is time to intoxicate.(｡･ω･｡)ﾉ❤♡❤♡❤♡❤♡',
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
      <img
        alt='helper'
        src={require('../../global/help.png')}
        id='helper'
        onClick={guider}
      ></img>
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
const StepUserprofile = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#profile_info',

        intro: 'Here is your profile.',
      },
      {
        element: '#subshows_container',
        intro: 'Your favorite shows.',
      },
      {
        element: '#historyshows_container',
        intro: 'Your browsing history.',
      },

      {
        element: '#creator_userprofile_btn',
        intro: 'Click here to update your profile.',
      },
      {
        intro: '♡❤♡❤♡❤♡❤♡❤Now it is time to intoxicate.(｡･ω･｡)ﾉ❤♡❤♡❤♡❤♡',
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
      <img
        alt='helper'
        src={require('../../global/help.png')}
        id='helper'
        onClick={guider}
      ></img>
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
const StepEditUserprofile = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#upuser_image',
        intro: 'Choose your new photo.',
      },
      {
        element: '#update_userprofile_btn1',
        intro: 'Update new profile photo.',
      },
      {
        element: '#new_name',
        intro: 'Fill in new nickname.',
      },
      {
        element: '#new_email',
        intro: 'Fill in new E-mail address.',
      },
      {
        element: '#new_pwd',
        intro: 'Update your password.',
      },
      {
        element: '#update_userprofile_btn2',
        intro: 'Update new profile details.',
      },
      {
        intro: '♡❤♡❤♡❤♡❤♡❤Now it is time to intoxicate.(｡･ω･｡)ﾉ❤♡❤♡❤♡❤♡',
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
      <img
        alt='helper'
        src={require('../../global/help.png')}
        id='helper'
        onClick={guider}
      ></img>
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
const StepCreator = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#cp_container',
        intro: 'Hey, Creator !!  Here is you Podcast information.',
      },
      {
        element: '#show_status',
        intro: 'Switch your Podcast show status.',
      },
      {
        element: '#gomypage',
        intro: 'Click to go to you Podcast page.',
      },
      {
        element: '#rssfeed',
        intro: "Click to copy your RSS feed's URL.",
      },
      {
        element: '#copyQRcode',
        intro: 'Click to share your Podcast page.',
      },
      {
        element: '#creator_creatorpodcast_btn',
        intro: 'Click here to update your Podcast details.',
      },
      {
        intro: '♡❤♡❤♡❤♡❤♡❤Now it is time to intoxicate.(｡･ω･｡)ﾉ❤♡❤♡❤♡❤♡',
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
      <img
        alt='helper'
        src={require('../../global/help.png')}
        id='helper'
        onClick={guider}
      ></img>
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
const StepEditCreator = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#cp_upload_image',
        intro: 'Hey, Creator !!  Here is you Podcast information.',
      },
      {
        element: '#newshowimage',
        intro: 'Switch your Podcast show status.',
      },
      {
        element: '#upcp_r',
        intro: 'Click to go to you Podcast page.',
      },
      {
        element: '#new_creator_info',
        intro: "Click to copy your RSS feed's URL.",
      },
      {
        intro: '♡❤♡❤♡❤♡❤♡❤Now it is time to intoxicate.(｡･ω･｡)ﾉ❤♡❤♡❤♡❤♡',
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
      <img
        alt='helper'
        src={require('../../global/help.png')}
        id='helper'
        onClick={guider}
      ></img>
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
const StepEpi = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#cp_upload_image',
        intro: 'Hey, Creator !!  Here is you Podcast information.',
      },
      {
        element: '#newshowimage',
        intro: 'Switch your Podcast show status.',
      },
      {
        element: '#upcp_r',
        intro: 'Click to go to you Podcast page.',
      },
      {
        element: '#new_creator_info',
        intro: "Click to copy your RSS feed's URL.",
      },
      {
        intro: '♡❤♡❤♡❤♡❤♡❤Now it is time to intoxicate.(｡･ω･｡)ﾉ❤♡❤♡❤♡❤♡',
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
      <img
        alt='helper'
        src={require('../../global/help.png')}
        id='helper'
        onClick={guider}
      ></img>
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
const StepEditEpi = () => {};
const Step = {
  StepChatroom,
  StepUserprofile,
  StepEditUserprofile,
  StepCreator,
  StepEditCreator,
  StepEpi,
  StepEditEpi,
};
export default Step;
