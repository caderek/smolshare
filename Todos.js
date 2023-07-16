class Todos {
  #collection;

  constructor(todos = []) {
    this.#collection = todos;
  }

  get all() {
    return structuredClone(this.#collection);
  }

  get completed() {
    return this.#collection.find((todo) => todo.completed);
  }

  get(todoId) {
    return this.#collection.find((todo) => todo.id === todoId);
  }

  add(todo) {
    this.#collection.push(todo);
  }

  contains(todoId) {
    return this.#collection.some((todo) => todo.id === todoId);
  }

  remove(todoId) {
    if (!this.contains(todoId)) return;

    this.#collection = this.#collection.filter((todo) => todo.id !== todoId);
  }
}

// Then use it like this:
const todos = new Todos([{ id: 1, content: "Do some work!" }]);

// Get a todo
const todo = todos.get(2);

// Remove a todo
todos.remove(2);
