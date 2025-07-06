import { VercelRequest, VercelResponse } from '@vercel/node';
import { todos } from '../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { title, description, category, completed } = req.body;
    const index = todos.findIndex(item => item.id === id);
    if (index === -1) return res.status(404).send('Not found');

    todos[index] = {
      ...todos[index],
      title,
      description,
      category,
      dueDate: new Date(),
      completed
    };

    res.status(200).send('success');
  } else if (req.method === 'DELETE') {
    const index = todos.findIndex(item => item.id === id);
    if (index === -1) return res.status(404).send('Not found');

    todos.splice(index, 1);
    res.status(200).send('success');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
