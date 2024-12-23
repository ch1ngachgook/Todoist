import React from 'react';


class Todo extends React.PureComponent {
  render() {
    const { todo, onDelete, onCheck } = this.props;
    return (
      <li className="todo-item">
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={onCheck}
          className="checkbox"
        />
        <div className="todo-content">
          <strong>{todo.title}</strong>
          <p>{todo.description}</p>
          <small>{todo.createdAt}</small>
        </div>
        <button className="delete-btn" onClick={onDelete}>Удалить</button>
      </li>
    );
  }
}

export default Todo;