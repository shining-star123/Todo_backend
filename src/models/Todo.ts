import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
    category: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
}

const TodoSchema: Schema = new Schema({
    category: String,
    title: String,
    description: String,
    dueDate: Date,
    completed: Boolean,
});

const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
export default Todo;