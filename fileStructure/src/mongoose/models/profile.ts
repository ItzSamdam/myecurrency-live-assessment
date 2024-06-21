import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Profile interface extending mongoose.Document
interface IProfile extends Document {
    bio: string;
    user: mongoose.Types.ObjectId;
}

// Define the Profile schema
const ProfileSchema: Schema<IProfile> = new Schema({
    bio: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Create the Profile model
const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
