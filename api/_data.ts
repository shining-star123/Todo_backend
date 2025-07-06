export interface Item {
  id: string;
  category: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

export let categories: string[] = [];
export let todos: Item[] = [];
