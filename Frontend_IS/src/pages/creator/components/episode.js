import Episingle from './episingle';
import Step from '../../step/steps';
const Episode = ({ creatorepisode }) => {
  return creatorepisode.length < 1 ? (
    <div id='noepi_yet'>
      <Step.StepNoEpi />
      Hi, Creator! Create Your Podcast New Episode First.
    </div>
  ) : (
    <>
      <div id='allepi_container'>
        {creatorepisode.map((item, i) => {
          return <Episingle item={item} i={i} />;
        })}
      </div>
    </>
  );
};
export default Episode;
