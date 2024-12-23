import React from "react";
import "./App.css"; 
import { generateTodos } from "./generate-todos";
import Todo from "./Todo"; 

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      task: "",
      description: "",
      severity: "medium",
      search: "",
      selectedSeverities: [],
      todos: [],
      showOnlyIncomplete: false,
      isLoading: false,
    };
  }

  handleTaskChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSeverityChange = (e) => {
    this.setState({ severity: e.target.value });
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  handleSeverityFilterChange = (e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const { selectedSeverities } = prevState;
      if (selectedSeverities.includes(value)) {
        return { selectedSeverities: selectedSeverities.filter(severity => severity !== value) };
      } else {
        return { selectedSeverities: [...selectedSeverities, value] };
      }
    });
  };

  generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  handleAddTodo = () => {
    const { task, description, severity, todos } = this.state;
    if (task.trim() === "") return;

    const newTodo = {
      id: this.generateUniqueId(),
      title: task.trim(),
      description: description.trim(),
      severity: severity,
      checked: false,
      createdAt: new Date().toLocaleString(),
    };

    this.setState({
      todos: [newTodo, ...todos],
      task: "",
      description: "",
      severity: "medium",
    });
  };

  handleTodoChecked = (id) => {
    this.setState((prevState) => {
      const newTodos = prevState.todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, checked: !todo.checked };
        }
        return todo;
      });
      return { todos: newTodos };
    });
  };

  handleDeleteTodo = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter(todo => todo.id !== id),
    }));
  };

  toggleFilter = () => {
    this.setState((prevState) => ({
      showOnlyIncomplete: !prevState.showOnlyIncomplete,
    }));
  };

  generateTodos = () => {
    this.setState({ 
      isLoading: true,
    });
    setTimeout(() => {
      this.setState({ 
        todos: generateTodos(1000),
        isLoading: false  
      });
    }, 2000);
  };

  render() {
    const { todos, showOnlyIncomplete, isLoading, search, selectedSeverities } = this.state;

    const filteredTodos = todos.filter(todo => {
      const searchTerm = search.toLowerCase();
      return (
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm)
      );
    });

    const incompleteTodos = showOnlyIncomplete
      ? filteredTodos.filter(todo => !todo.checked)
      : filteredTodos;

    const severityFilteredTodos = selectedSeverities.length > 0
      ? incompleteTodos.filter(todo => selectedSeverities.includes(todo.severity))
      : incompleteTodos;

    const sortedTodos = severityFilteredTodos.sort((a, b) => a.checked - b.checked);
    const doneCount = todos.filter((todo) => todo.checked).length;
    const uniqueSeverities = Array.from(new Set(todos.map(todo => todo.severity)));

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="app-container">
        <h1>TODO List</h1>

        <div className="input-container">
          <input
            type="text"
            placeholder="Задача"
            value={this.state.task}
            onChange={this.handleTaskChange}
            className="input-task"
          />
          <textarea
            placeholder="Описание"
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            className="description-textarea"
          />
          <select value={this.state.severity} onChange={this.handleSeverityChange} className="severity-select">
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
          <button onClick={this.handleAddTodo} className="add-btn">Добавить</button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={this.handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="severity-filter">
          {uniqueSeverities && uniqueSeverities.length > 0 && uniqueSeverities.map(severity => (
            severity ? ( // Проверка на наличие значения
              <label key={severity}>
                <input
                  type="checkbox"
                  value={severity}
                  checked={selectedSeverities.includes(severity)}
                  onChange={this.handleSeverityFilterChange}
                />
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </label>
            ) : null
          ))}
        </div>

        <label className="filter-label">
          <input
            type="checkbox"
            checked={this.state.showOnlyIncomplete}
            onChange={this.toggleFilter}
          />
          Только невыполненные
        </label>
        
        <div>
          <div>
            Количество выполненных задач: {doneCount}
          </div>
        </div>

        <ul className="todo-list">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                onDelete={() => this.handleDeleteTodo(todo.id)}
                onCheck={() => this.handleTodoChecked(todo.id)}
              />
            ))
          ) : (
            <li>По вашим критериям ничего не найдено.</li>
          )}
        </ul>

        <button onClick={this.generateTodos} className="generate-btn">
          Сгенерировать 1000 задач
        </button>
      </div>
    );
  }
}

export default App;