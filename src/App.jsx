import { useState, useEffect } from "react";
import "ninja-keys";
import "./App.css";

function Todo({ id, text, done, onDelete, onDone }) {
  function handleCheckBoxCheck(e) {
    onDone(e.target.checked);
  }

  return (
    <li>
      <input
        className="item-done-checkbox"
        type="checkbox"
        checked={done}
        onChange={(e) => {
          handleCheckBoxCheck(e);
        }}
      />
      <label>{text}</label>

      <button className="btn btn-danger" onClick={() => onDelete()}>
        Delete
      </button>
    </li>
  );
}

function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState([]);
  const inProgressItemsCount = todos.filter((todo) => !todo.done).length;
  const doneItemsCount = todos.filter((todo) => todo.done).length;

  const ninja = document.querySelector("ninja-keys");
  ninja.data = [
    {
      id: "SayHello",
      title: "Say Hello!",
      hotkey: "",
      icon: "apps",
      section: "Projects",
      handler: () => {
        // it's auto register above hotkey with this handler
        alert("Hello there!");
      },
    },
    {
      id: "Theme",
      title: "Change theme...",
      icon: "desktop_windows",
      children: ["Light Theme", "Dark Theme", "System Theme"],
      hotkey: "ctrl+T",
      handler: () => {
        // open menu if closed. Because you can open directly that menu from it's hotkey
        ninja.open({ parent: "Theme" });
        // if menu opened that prevent it from closing on select that action, no need if you don't have child actions
        return { keepOpen: true };
      },
    },
    {
      id: "Light Theme",
      title: "Change theme to Light",
      icon: "light_mode",
      parent: "Theme",
      handler: () => {
        // simple handler
        document.documentElement.classList.remove("dark");
      },
    },
    {
      id: "Dark Theme",
      title: "Change theme to Dark",
      icon: "dark_mode",
      parent: "Theme",
      handler: () => {
        // simple handler
        document.documentElement.classList.add("dark");
      },
    },
  ];

  useEffect(() => {
    localStorage.setItem("TODOS", JSON.stringify(todos));
  }, [todos]);

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!newItem) return;
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), text: newItem, done: false },
    ]);
    setNewItem("");
  }

  function handleOnDelete(todoID) {
    console.log(todoID);
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => {
        return todo.id !== todoID;
      });
    });
  }

  function handleOnDone(index, done) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo, i) => {
        if (i === index) {
          return { ...todo, done: done };
        }
        return todo;
      });
    });
  }

  return (
    <>
      <h1 className="header">
        Kypup Tasks <span id="version">v0.0.1</span>
      </h1>
      <form onSubmit={handleFormSubmit} className="new-item-form">
        <div className="form-row">
          <input
            type="text"
            autoFocus={true}
            value={newItem}
            id="item-input"
            name="item"
            placeholder="Add new item"
            onChange={(e) => {
              setNewItem(e.target.value);
            }}
          />
          <button className="item-add-button">Add Item</button>
        </div>
      </form>
      <h2 className="sub-category">
        In Progress Tasks ({inProgressItemsCount})
      </h2>
      <ul className="todo-list">
        {todos.map((todo, index) => {
          if (todo.done) return;
          return (
            <Todo
              key={todo.id}
              id={todo.id}
              text={todo.text}
              done={todo.done}
              onDelete={() => {
                handleOnDelete(todo.id);
              }}
              onDone={(checked) => {
                handleOnDone(index, checked);
              }}
            />
          );
        })}
      </ul>
      <h2 className="sub-category">Completed Tasks ({doneItemsCount})</h2>
      <ul className="todo-list">
        {todos.map((todo, index) => {
          if (!todo.done) return;
          return (
            <Todo
              key={todo.id}
              id={todo.id}
              text={todo.text}
              done={todo.done}
              onDelete={() => {
                handleOnDelete(todo.id);
              }}
              onDone={(checked) => {
                handleOnDone(index, checked);
              }}
            />
          );
        })}
      </ul>
    </>
  );
}

export default App;
