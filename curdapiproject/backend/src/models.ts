import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// User
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

// Schema
const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password save before
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison 
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

//  Model for CRUD opp
export interface IData extends Document {
    title: string;
    description: string;
}

const dataSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);
export const Data = mongoose.model<IData>('Data', dataSchema);
