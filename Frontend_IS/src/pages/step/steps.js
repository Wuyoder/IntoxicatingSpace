import { Steps, Hints } from 'intro.js-react';
import { useState } from 'react';
const StepShowchoice = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '.show_info_container',

        intro: 'Podcast information',
      },
      {
        element: '#sub_container',
        intro: 'Sign in first, and click to sub/unsub this podcast.',
      },
      {
        element: '.show_epi_container',
        intro: 'All episodes in this podcast.',
      },

      {
        element: '.episode_card_container',
        intro: "Choose your favorite and click to 'Play'.",
      },
      {
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
        element: '#chatroom',
        intro: 'Please sign in to share your thoughts.',
      },
      {
        element: '.msg_time',
        intro: 'Click to locate the progress.',
      },
      {
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
        intro: 'Click to go to your Podcast page.',
      },
      {
        element: '#creator_episode_btn',
        intro: 'You need to create at least one episode to activate your page.',
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
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
        element: '#single_epi_parts',
        intro: 'Your Episode information and status',
      },
      {
        element: '#single_epi_edit',
        intro: "Click 'Edit' to update episode details.",
      },
      {
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
const StepNoEpi = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#creator_episode_btn',
        intro: 'Click here to start your first Podcast show!',
      },
      {
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
const StepNewEpi = () => {
  const [intro, setIntro] = useState(false);
  const state = {
    stepsEnabled: intro,
    initialStep: 0,
    skipLabel: 'skip',
    steps: [
      {
        element: '#newepi_form',
        intro: 'Fill in your creative thoughts about the show.',
      },
      {
        element: '#photo_btn',
        intro: 'Choose the image (.jpg/.png) belongs to your show.',
      },
      {
        element: '#microphone_btn',
        intro: "Choose the show's audio file (.mp3).",
      },
      {
        element: '#newepi_btn',
        intro: 'Publish the amazing show now!',
      },
      {
        intro: 'Now it is time to intoxicate.(｡･ω･｡)ﾉ❤❤❤',
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
const Step = {
  StepChatroom,
  StepUserprofile,
  StepEditUserprofile,
  StepCreator,
  StepEditCreator,
  StepEpi,
  StepNoEpi,
  StepNewEpi,
  StepShowchoice,
};
export default Step;
