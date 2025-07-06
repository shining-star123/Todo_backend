import { VercelRequest, VercelResponse } from '@vercel/node';
import { categories } from './_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.json(categories);
  } else if (req.method === 'POST') {
    const { title } = req.body;
    if (title) {
      categories.push(title);
      res.status(200).send('success');
    } else {
      res.status(400).send('Missing title');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
