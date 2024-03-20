const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors())

// Connect to MongoDB
try {
    mongoose.connect('mongodb+srv://akpatel:adssadfsdf2323@cluster0.de35six.mongodb.net/toDo');
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
}

// Define schema and model for todo
const todoSchema = new mongoose.Schema({
    text: String
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware
app.use(express.json());

// Routes
app.get('/todoList', async (req, res) => {
    try {
        const todoList = await Todo.find();
        res.json(todoList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/todoList', async (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/todoList/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
