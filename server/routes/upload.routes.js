import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPodcast, deletePodcast, getAllPodcasts, getLikedPodcasts, getSubscribingPodcasts, getUserPodasts, getPodcastsByCategory, likeUnlikePodcast, savedPodcast, searchPodcasts, uploadPlaylist, uploadVideo, getClickedPodcast, getRelatedPodcast, getSavedPodcast, getAllPlaylists, getPlaylistById} from "../controllers/upload.controller.js";


const router = express.Router();

router.get("/all",getAllPodcasts)
router.get("/likedpod/:id",getLikedPodcasts)
router.get("/subspod/:id",protectRoute,getSubscribingPodcasts)
router.get("/userpod/:id",getUserPodasts)
router.get("/podcast/:id",getClickedPodcast)
router.get('/related/:id',getRelatedPodcast)
router.get('/getsaved/:id',getSavedPodcast)
router.get('/playlists/:id',getAllPlaylists)
router.get('/playlistbyid/:id',getPlaylistById)

router.get("/search/:key",searchPodcasts)
router.get("/category/:key",getPodcastsByCategory)


router.post("/playlist",protectRoute,uploadPlaylist)
router.post("/video",protectRoute,uploadVideo)
router.delete("/:id",protectRoute,deletePodcast)
router.post("/comment/:id", protectRoute, commentOnPodcast)
router.post("/like/:id", protectRoute, likeUnlikePodcast)
router.post("/saved/:id",protectRoute, savedPodcast)

export default router;