const Item = ({ id, note, date, time, deleteData, reference }) => {
  function deleteItem() {
    deleteData(function (prev) {
      reference.current = true;
      return prev.filter((item) => item.id !== id);
    });
  }

  return (
    <div>
      <div>
        <p>{note}</p>
        <p>{`${date} ${time}`}</p>
      </div>
      <button onClick={deleteItem}>remove</button>
    </div>
  );
};
export default Item;
