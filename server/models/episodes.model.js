import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    thumbnail: {
        type: String,
        
    },
    audioVideo: {
        type: String,
       
    },
    episodeName: {
        type: String,
        required: true
    },
    episodeDescription: {
        type: String,
        required:true
    },
    episodeType: {
        type: String,
        required:true
    },
    episodeCategory: {
        type: String,
        required:true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        },


    ],
},
    {
        timestamps: true,
    }
)

episodeSchema.pre('save', function(next) {
    this.comments.forEach(comment => {
      if (comment.isModified()) {
        comment.updatedAt = new Date();
      }
    });
    next();
  }); 

export default mongoose.model("Episodes", episodeSchema)