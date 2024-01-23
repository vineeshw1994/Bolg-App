import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F013%2F042%2F571%2Foriginal%2Fdefault-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg&tbnid=VVinhj0hmixU0M&vet=12ahUKEwj6kpqu4vCDAxXprGMGHT3nC0kQMygCegQIARBV..i&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F13042571-default-avatar-profile-icon-vector-social-media-user-photo-in-flat-style&docid=zPHZrLkhzPRhiM&w=1920&h=1920&q=profile%20avatar&ved=2ahUKEwj6kpqu4vCDAxXprGMGHT3nC0kQMygCegQIARBV',
    },

    isAdmin: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });


const User = mongoose.model("User", userSchema);

export default User;