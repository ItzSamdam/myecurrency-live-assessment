import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the User interface extending mongoose.Document
interface IUser extends Document {
    username: string;
    email: string;
    profile: mongoose.Types.ObjectId;
    password: string;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    password: { type: String, required: true }
});

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
