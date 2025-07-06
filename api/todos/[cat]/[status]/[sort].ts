import { VercelRequest, VercelResponse } from '@vercel/node';
import { todos, Item } from '../../../_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { cat, status, sort } = req.query;
  let result: Item[] = [];

  const statusNum = Number(status);
  const sortNum = Number(sort);

  if (cat === 'all') {
    if (statusNum === 0) result = [...todos];
    else result = todos.filter(item => item.completed === (statusNum === 2));
  } else {
    if (statusNum === 0) result = todos.filter(item => item.category === cat);
    else result = todos.filter(item => item.category === cat && item.completed === (statusNum === 2));
  }

  result.sort((a, b) => {
    return sortNum === -1
      ? Number(new Date(a.dueDate)) - Number(new Date(b.dueDate))
      : Number(new Date(b.dueDate)) - Number(new Date(a.dueDate));
  });

  res.json(result);
}
