import Episingle from './episingle';

const Episode = ({ creatorepisode }) => {
  console.log('creatorepisode', creatorepisode);
  return creatorepisode.length < 1 ? (
    <div id='noepi_yet'>
      Hi, Creator! Create Your Podcast New Episode First.
    </div>
  ) : (
    <div id='allepi_container'>
      {creatorepisode.map((item, i) => {
        return <Episingle item={item} i={i} />;
      })}
    </div>
  );
};
export default Episode;
