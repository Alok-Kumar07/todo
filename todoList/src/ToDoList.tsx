import React, { useState, useEffect } from "react";

interface Item {
    id: number;
    text: string;
    completed: boolean;
}

const ToDoList: React.FC = () => {
    const [todos, setTodos] = useState<Item[]>([]);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch("http://localhost:3000/todoList");
            if (!response.ok) {
                throw new Error("Failed to fetch todos");
            }
            const data = await response.json();
            setTodos(data);
            console.log(data);
            
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/todoList/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ completed: !todos.find(todo => todo.id === id)?.completed })
            });
            if (!response.ok) {
                throw new Error("Failed to toggle todo");
            }
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/todoList/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete todo");
            }
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = async () => {
        if (input.trim() !== "") {
            try {
                const response = await fetch("http://localhost:3000/todoList", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: input })
                });
                if (!response.ok) {
                    throw new Error("Failed to add todo");
                }
                setInput("");
                fetchTodos();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="main-container">
            <h1>Todo List</h1>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id} onClick={() => handleToggle(todo.id)} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                        {todo.text}
                        <button onClick={() => handleDelete(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Add todo item"
                value={input}
                onChange={handleInputChange}
            />
            <button onClick={handleClick}>Add</button>
        </div>
    );
};

export default ToDoList;
