import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    title: string;
}

const CategorySchema: Schema = new Schema({
    title: String,
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;