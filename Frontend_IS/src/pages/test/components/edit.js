import { useState } from 'react';
import { v4 } from 'uuid';

const Edit = ({ add, reference }) => {
  const [note, setNote] = useState('');
  function noteChange(e) {
    setNote(e.target.value);
  }
  const [date, setDate] = useState('');
  function dateChange(e) {
    setDate(e.target.value);
  }
  const [time, setTime] = useState('');
  function timeChange(e) {
    setTime(e.target.value);
  }

  console.log(note, date, time);
  function addItem() {
    reference.current = true;
    add(function (prevData) {
      return [{ id: v4(), note, date, time }, ...prevData];
    });
  }

  return (
    <div>
      <h1>備忘錄</h1>
      <p>記事</p>
      <input type='text' value={note} onChange={noteChange} />
      <input type='date' value={date} onChange={dateChange} />
      <input type='time' value={time} onChange={timeChange} />
      <button onClick={addItem}>create </button>
    </div>
  );
};
export default Edit;
