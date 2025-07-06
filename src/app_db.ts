import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Router, Request, Response } from 'express';
import connectDB from './config/db';
import Todo from './models/Todo';
import Category from './models/Category';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: '*'
}))

app.use(express.json());
app.use(bodyParser.json());

app.get('/category', async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
})

app.post('/category', async (req: Request, res: Response) => {
    try {
        const newCategory = new Category(req.body);
        const cat = await newCategory.save();
        res.send("success");
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
})

app.get('/todos/:cat/:status/:sort', async (req: Request, res: Response) => {
    const { cat } = req.params;
    const status: number = Number(req.params.status);
    const sort: number = Number(req.params.sort);

    try {
        if (cat === 'all') {
            if (status === 0) {
                const todos = await Todo.find().sort({ dueDate: sort === 1 ? 1 : -1 })
            } else {
                const todos = await Todo.find({ completed: (status === 1 ? false : true) }).sort({ dueDate: sort === 1 ? 1 : -1 })
            }
        } else {
            if (status === 0) {
                const todos = await Todo.find({ category: cat }).sort({ dueDate: sort === 1 ? 1 : -1 });
            } else {
                const todos = await Todo.find({ category: cat, completed: (status === 1 ? false : true) }).sort({ dueDate: sort === 1 ? 1 : -1 })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
})

app.post('/todos', async (req: Request, res: Response) => {
    const newTodo = new Todo(req.body);

    const t = await newTodo.save();

    res.send("success");
})

app.put('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, completed } = req.body;

    const todo = await Todo.findById(id);

    if (todo) {
        todo.title = title;
        todo.description = description;
        todo.category = category;
        todo.completed = completed;
        todo.dueDate = new Date();

        const t = await todo.save();
        res.send("success");
    } else {
        res.status(500).json({ message: 'Error fetching todos' });
    }
})

app.delete('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);

        res.send("success");
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});