import Upload from "../models/upload.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import Episodes from '../models/episodes.model.js'

export const uploadPlaylist = async (req, res) => {
    try {
        let {
            coverImg,
            podcastName,
            podcastDescription,
            podcastTags,
            podcastFormat,
            podcastCategory } = req.body;

        let { episodes } = req.body

        const userId = req.user._id.toString();

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (!podcastName && !audioVideo) {
            return res.status(400).json({ error: "Podcast must have caption and video " })
        }

        if (coverImg) {
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url
        }

        let episodeList = []
        await Promise.all(episodes.map(async (episodesData) => {
            let newEpisode = { ...episodesData };

            if (!newEpisode.audioVideo) {
                return res.status(400).json({ error: "no audiovideo file provided" })
            }

            if (newEpisode.audioVideo) {
                const uploadedResponse = await cloudinary.uploader.upload_large(newEpisode.audioVideo, { resource_type: 'video', chunk_size: 600000000 })
                newEpisode.audioVideo = uploadedResponse.secure_url
            }

            if (!newEpisode.thumbnail) {
                return res.status(400).json({ error: "no thumbnail file provided" })
            }
            if (newEpisode.thumbnail) {
                const uploadedResponse = await cloudinary.uploader.upload(newEpisode.thumbnail, { resource_type: 'image', })
                newEpisode.thumbnail = uploadedResponse.secure_url
            }

            const savedEpisode = new Episodes({
                user: userId,
                ...newEpisode,
            })
            await savedEpisode.save();
            episodeList.push(savedEpisode._id)
        }))

        const newUpload = new Upload({
            user: userId,
            coverImg,
            podcastName,
            podcastDescription,
            podcastTags,
            podcastFormat,
            podcastCategory,
            episodes: episodeList
        })

        await newUpload.save();
        res.status(201).json(newUpload);

    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const uploadVideo = async (req, res) => {
    try {
        let { episodes } = req.body;
        const userId = req.user._id.toString();

        const uploadPromises = episodes.map(async (episodesData) => {
            let newEpisode = { ...episodesData };

            if (!newEpisode.thumbnail) {
                throw new Error("No thumbnail file provided");
            }

            const thumbnailUploadResponse = await cloudinary.uploader.upload(newEpisode.thumbnail, {
                resource_type: 'image',
            });
            newEpisode.thumbnail = thumbnailUploadResponse.secure_url;

            if (!newEpisode.audioVideo) {
                throw new Error("No audio/video file provided");
            }

            const audioVideoUploadResponse = await cloudinary.uploader.upload_large(newEpisode.audioVideo, {
                resource_type: 'video',
            });

            newEpisode.audioVideo = audioVideoUploadResponse.secure_url;

            const savedEpisode = new Episodes({
                user: userId,
                ...newEpisode,
            });

            await savedEpisode.save();
        });

        await Promise.all(uploadPromises);
        res.status(200).json({ message: 'All episodes uploaded successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred during upload' });
    }
};

export const deletePodcast = async (req, res) => {
    try {
        const post = await Upload.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" })
        }

        if (post.video) {
            const videoId = post.video.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(videoId)
        }
        await Upload.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.log("Error in deletePost controller:", error);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const commentOnPodcast = async (req, res) => {
    try {
        const { text } = req.body;
        const podcastId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "text field is required" })
        }
        const podcast = await Episodes.findById(podcastId)
        if (!podcast) {
            return res.status(404).json({ error: "Post not found" })
        }

        const comment = { user: userId, text }

        podcast.comments.push(comment);
        await podcast.save();

        res.status(200).json(podcast)

    } catch (error) {
        console.log("Error in deletePost controller", error);
        res.status(500).json({ error: " internal server error" })
    }
}

export const likeUnlikePodcast = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: podcastId } = req.params;

        const podcast = await Episodes.findById(podcastId);

        if (!podcast) {
            return res.status(404).json({ error: "Post not found" })
        }

        const userLikedPodcast = podcast.likes.includes(userId);

        //unlike post
        if (userLikedPodcast) {
            await Episodes.updateOne({ _id: podcastId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: podcastId } })

            const updatedLikes = podcast.likes.filter((id) => id.toString() !== userId.toString())
            res.status(200).json(updatedLikes)
        }
        else {
            podcast.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: podcastId } });
            await podcast.save();

            const updatedLikes = podcast.likes;
            res.status(200).json(updatedLikes)
        }
    } catch (error) {
        console.log("error in likedunlikedpost controller", error)
        res.status(500).json({ error: 'internal server error' })
    }
}

export const getClickedPodcast = async (req, res) => {
    try {
        const { id: podcastId } = req.params;
        const podcast = await Episodes.findById(podcastId)
            .populate({
                path: 'user',
                select: '-password'
            }).populate({
                path: "comments.user",
                select: "-password"
            })
        if (!podcast) {
            return res.status(404).json({ error: 'Podcast not found' })
        }
        const video = await Episodes.findByIdAndUpdate(podcastId, { $inc: { views: 1 } }, { new: true });
        res.status(200).json(podcast);
    } catch (error) {
        console.log("erro in getClickedpodcast constroller", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getAllPlaylists = async (req, res) => {

    try {
        const { id: userId } = req.params

        const podcast = await Upload.find({ user: userId }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
            .populate({
                path: "episodes.user",
                select: "-password"
            });
        if (podcast.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(podcast);
    } catch (error) {
        console.log("error in getAllPlaylists controller:", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}
export const getPlaylistById = async (req, res) => {
    try {
        const podcast = await Upload.findById(req.params.id)
            .populate({
                path: "user",
                select: "-password",
            })
            .populate('episodes')
            .populate({
                path: 'episodes.user',
                select: "-password"
            })
        if (!podcast) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        res.status(200).json(podcast);
    } catch (error) {
        console.log("Error in getPlaylistById controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAllPodcasts = async (req, res) => {

    try {
        const podcast = await Episodes.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
            .populate({
                path: "comments.user",
                select: "-password"
            })
        if (podcast.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(podcast);
    } catch (error) {
        console.log("error in getAllPodcasts controller:", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const searchPodcasts = async (req, res) => {
    try {
        const searchKey = new RegExp(req.params.key, 'i');

        const podcasts = await Episodes.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $match: {
                    $or: [
                        { 'user.fullname': { $regex: searchKey } },
                        { episodeName: { $regex: searchKey } },
                        { episodeCategory: { $regex: searchKey } },
                        { episodeDescription: { $regex: searchKey } }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    'user.password': 0
                }
            }
        ])
            .limit(6)
            ;
        res.status(200).json(podcasts);
    } catch (error) {
        console.log('error in searchPodcasts', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const getPodcastsByCategory = async (req, res) => {
    try {
        const searchKey = req.params.key.toLowerCase();

        // Check if the key is "trending"
        if (searchKey === "trending") {
            console.log(`Fetching all trending podcasts`);

            const trendingPodcasts = await Episodes.find()
                .sort({ likes: -1, views: -1 })
                .populate({
                    path: 'user',
                    select: "-password",
                });

            if (trendingPodcasts.length === 0) {
                console.log("No trending podcasts found");
                return res.status(404).json({ message: "No trending podcasts found" });
            }

            console.log("Trending podcasts found:", trendingPodcasts);
            return res.status(200).json(trendingPodcasts);
        }

        // Otherwise, search by category
        console.log(`Fetching podcasts for category: ${searchKey}`);
        const categoryPodcasts = await Episodes.find({
            episodeCategory: { $regex: new RegExp(searchKey, "i") }
        })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: "-password",
            });

        if (categoryPodcasts.length > 0) {
            console.log("Category podcasts found:", categoryPodcasts);
            return res.status(200).json(categoryPodcasts);
        } else {
            console.log("No podcasts found for the given category");
            return res.status(404).json({ message: "No podcasts found for the given category" });
        }

    } catch (error) {
        console.error("Error in getPodcastsByCategory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const savedPodcast = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Episodes.findById(postId);
        const user = await User.findById(userId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const saved = user.savedPosts.includes(postId)

        if (saved) {
            //unsave post
            await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } })
            res.status(200).json("unsaved successfully")
        }
        else {
            //save post
            await User.updateOne({ _id: userId }, { $push: { savedPosts: postId } })
            res.status(200).json("saved successfully")
        }
    } catch (error) {
        console.log("error in savedPosts controller:", error);
        res.status(500).json({ error: "internal server error" })
    }
}

export const getLikedPodcasts = async (req, res) => {
    const { id: userId } = req.params

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.staus(404).json({ error: "user not found" })
        }

        const likedPodcasts = await Episodes.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(likedPodcasts);
    } catch (error) {
        console.log("error in getliked controller:", error);
        res.status(500).json({ error: "internal server error" })
    }
}

export const getSubscribingPodcasts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "user not found" });

        const subscribing = user.subscribing

        const feedPodcasts = await Episodes.find({ user: { $in: subscribing } })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: "-password",

            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(feedPodcasts)
    } catch (error) {
        console.log("erro in getFollowingPosts controllers:", error);
        res.status(200).json({ error: "internal server error" })
    }
}

export const getUserPodasts = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "user not found" })

        const podcasts = await Episodes.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(podcasts);
    } catch (error) {
        console.log("error in getUser Podcasts controller:", error)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getRelatedPodcast = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Episodes.findById(id);

        if (!video) {
            return res.status(404).send("video not found")
        }

        const relatedPodcasts = await Episodes.find({
            $and: [
                { episodeCategory: { $ne: null } }, // Ensure episodeCategory is not null
                { episodeCategory: { $ne: "" } },  // Ensure episodeCategory is not an empty string
                { episodeCategory: video.episodeCategory }, // Match the episodeCategory
                { _id: { $ne: video._id } } // Exclude the current video
            ]
        })
            .populate({
                path: "user",
                select: "-password",
            })
            .limit(10);
        res.status(200).json(relatedPodcasts)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getSavedPodcast = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("User not found")
        }

        const savedPodcasts = await Episodes.find({ _id: { $in: user.savedPosts } })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(savedPodcasts)
    } catch (error) {
        console.log("error in getSavedPodcasts controller:", error)
        res.status(500).json({ error: "internal server error" })
    }
}