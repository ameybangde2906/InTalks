import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        coverImg: {
            type: String,

        },
        podcastName: {
            type: String,
            required: true,
        },
        podcastDescription: {
            type: String,
            required: true,
        },
        podcastTags: {
            type: String,
        },
        podcastFormat: {
            type: String,
            required: true,
            default: "audio"
        },
        podcastCategory: {
            type: String,
            required: true,
        },
        episodes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Episodes",
                default: [],
            },
        ]

    },
    { timestamps: true }
);

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload