export const generateTodos = (n = 1000) => {
   const todos = [];
   for (let i=0; i<n; i++){
    todos.push(generateTodo())
   } 
  
    return todos;
}

const generateTodo = () => ({
    title: getRandomString(), 
    description: "Описание задачи",
    checked: Math.random() > 0.5,
    createdAt: new Date().toLocaleString(),
    id: Date.now() + getRandomString(), 
});

const getRandomString = () => 
    Math.random().toString(36).substring(2, 15); 



