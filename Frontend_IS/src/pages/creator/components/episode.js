import Episingle from './episingle';

const Episode = ({ creatorepisode }) => {
  return (
    <div id='allepi_container'>
      {creatorepisode.map((item, i) => {
        return <Episingle item={item} i={i} />;
      })}
    </div>
  );
};
export default Episode;
