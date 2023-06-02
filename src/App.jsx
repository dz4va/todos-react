import { useState } from 'react'
import './App.css'

function Todo({ id, text, done, onDelete, onDone }) {

  function handleCheckBoxCheck(e) {
    onDone(e.target.checked);
  }

  return (
    <li>
      <input className='item-done-checkbox' type="checkbox" checked={done} onChange={e => { handleCheckBoxCheck(e) }} />
      <label>
        {text}
      </label>
      
      <button className='btn btn-danger' onClick={() => onDelete()}>Delete</button>
    </li>
  );
}

function App() {
  const [newItem, setNewItem] = useState('');
  const [todos, setTodos] = useState([]);
  const inProgressItemsCount = todos.filter(todo => !todo.done).length;
  const doneItemsCount = todos.filter(todo => todo.done).length;

  function handleFormSubmit(e) {
    e.preventDefault();
    setTodos(currentTodos => [...currentTodos, { id: crypto.randomUUID(), text: newItem, done: false }]);
    setNewItem('');
  }

  function handleOnDelete(todoID) {
    console.log(todoID);
    setTodos(currentTodos => {
      return currentTodos.filter((todo) => {
        return todo.id !== todoID;
      });
    });
  }

  function handleOnDone(index, done) {
    setTodos(currentTodos => {
      return currentTodos.map((todo, i) => {
        if (i === index) {
          return { ...todo, done: done };
        }
        return todo;
      });
    });
  }

  return (<>
    <h1 className='header'>Kypup Tasks <span id="version">v.0.0.1</span></h1>
    <form onSubmit={handleFormSubmit} className='new-item-form'>
      <div className='form-row'>
        <input type='text' autoFocus={true} value={newItem} id='item-input' name='item' placeholder='Add new item' onChange={e => { setNewItem(e.target.value) }} />
        <button className='item-add-button'>Add Item</button>
      </div>
    </form>
    <h2 className='sub-category'>In Progress Tasks ({inProgressItemsCount})</h2>
    <ul className='todo-list'>
      {
        todos.map((todo, index) => {
          if (todo.done) return;
          return <Todo key={todo.id} id={todo.id} text={todo.text} done={todo.done} onDelete={() => { handleOnDelete(todo.id) }} onDone={(checked) => { handleOnDone(index, checked) }} />
        })
      }
    </ul>
    <h2 className='sub-category'>Completed Tasks ({doneItemsCount})</h2>
    <ul className='todo-list'>
      {
        todos.map((todo, index) => {
          if (!todo.done) return;
          return <Todo key={todo.id} id={todo.id} text={todo.text} done={todo.done} onDelete={() => { handleOnDelete(todo.id) }} onDone={(checked) => { handleOnDone(index, checked) }} />
        })
      }
    </ul>
  </>);
}

export default App
