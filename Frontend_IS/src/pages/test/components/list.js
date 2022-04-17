import Item from './item';

const List = ({ listData, deleteData, reference }) => {
  return (
    <div>
      List
      {listData.map((e) => {
        const { note, date, time, id } = e;
        return (
          <Item
            id={id}
            key={id}
            note={note}
            date={date}
            time={time}
            deleteData={deleteData}
            reference={reference}
          />
        );
      })}
    </div>
  );
};
export default List;
