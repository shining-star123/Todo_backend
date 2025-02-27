import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Router, Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 5000;

interface Item {
    id: string;
    category: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
}

let categories: string[] = [];
let todos: Item[] = [];

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json());
app.use(bodyParser.json());

app.get('/category', (req: Request, res: Response) => {
    res.json(categories);
})

app.post('/category', (req: Request, res: Response) => {
    console.log(req.body.title);
    categories.push(req.body.title);
    res.send("success");
})

app.get('/todos/:cat/:status/:sort', (req: Request, res: Response) => {
    const { cat } = req.params;
    const status: number = Number(req.params.status);
    const sort: number = Number(req.params.sort);

    let result: Item[] = [];

    if (cat === 'all') {
        if (status === 0) result = todos.slice();
        else result = todos.filter(item => item.completed === (status === 1 ? false : true)).slice();
    } else {
        if (status === 0) result = todos.filter(item => item.category === cat).slice();
        else result = todos.filter(item => item.category === cat && item.completed === (status === 1 ? false : true)).slice();
    }

    result.sort((a: Item, b: Item) => {
        if (sort === -1) {
            return Number(a.dueDate) - Number(b.dueDate);
        } else {
            return Number(b.dueDate) - Number(a.dueDate);
        }
    })

    res.json(result);
})

app.post('/todos', (req: Request, res: Response) => {
    const { title, description, category, completed } = req.body;

    todos.push({
        id: new Date().toString(),
        category, title, description, dueDate: new Date(), completed
    });

    res.send("success");
})

app.put('/todos/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, completed } = req.body;

    let index = todos.findIndex(item => item.id === id);
    todos[index] = {
        ...todos[index],
        category, title, description, dueDate: new Date(), completed,
    }

    res.send("success");
})

app.delete('/todos/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    todos = todos.filter(item => item.id !== id);

    res.send("success");
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});