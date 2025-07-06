import { VercelRequest, VercelResponse } from '@vercel/node';
import { todos, Item } from './_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { title, description, category, completed } = req.body;
    const newTodo: Item = {
      id: new Date().toISOString(),
      title,
      description,
      category,
      dueDate: new Date(),
      completed
    };
    todos.push(newTodo);
    res.status(200).send('success');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
