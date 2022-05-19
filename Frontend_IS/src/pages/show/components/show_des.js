const ShowDes = ({ info }) => {
  const destext = () => {
    return { __html: info.description };
  };
  return (
    <>
      <div dangerouslySetInnerHTML={destext()}></div>
    </>
  );
};
export default ShowDes;
