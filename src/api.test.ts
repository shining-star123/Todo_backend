import request from 'supertest';
import app from './app';

describe('Category endpoints', () => {
  beforeEach(() => {
    // reset in-memory arrays
    (global as any).categories = [];
  });

  it('should start with no categories', async () => {
    const res = await request(app).get('/category');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should add a new category', async () => {
    const res = await request(app)
      .post('/category')
      .send({ title: 'work' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('success');

    const list = await request(app).get('/category');
    expect(list.body).toContain('work');
  });
});

describe('Todo endpoints', () => {
  beforeEach(() => {
    (global as any).todos = [];
    (global as any).categories = ['home'];
  });

  it('POST /todos then GET all', async () => {
    await request(app)
      .post('/todos')
      .send({
        title: 'Task 1',
        description: 'Desc',
        category: 'home',
        completed: false
      })
      .expect(200, 'success');

    const res = await request(app).get('/todos/all/0/1'); // all, status=0 (all), sort descending
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      title: 'Task 1',
      description: 'Desc',
      category: 'home',
      completed: false
    });
  });

  it('PUT /todos/:id updates item', async () => {
    const post = await request(app)
      .post('/todos')
      .send({
        title: 'Old',
        description: 'OldDesc',
        category: 'home',
        completed: false
      });
    // grab the generated id
    const getAll = await request(app).get('/todos/all/0/1');
    const { id } = getAll.body[0];

    await request(app)
      .put(`/todos/${encodeURIComponent(id)}`)
      .send({
        title: 'New',
        description: 'NewDesc',
        category: 'home',
        completed: true
      })
      .expect(200, 'success');

    const updated = await request(app).get('/todos/all/0/1');
    expect(updated.body[0].title).toBe('New');
    expect(updated.body[0].completed).toBe(true);
  });

  it('DELETE /todos/:id removes item', async () => {
    await request(app)
      .post('/todos')
      .send({ title: 'X', description: 'Y', category: 'home', completed: false });
    const all = await request(app).get('/todos/all/0/1');
    const id = all.body[0].id;

    await request(app).delete(`/todos/${encodeURIComponent(id)}`).expect(200, 'success');
    const again = await request(app).get('/todos/all/0/1');
    expect(again.body).toHaveLength(0);
  });
});