import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';
import { Close, CloudUpload } from '@mui/icons-material';
import { useState } from 'react';
import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";
import { endPoint } from '../../utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { closeUpload, openUpload } from '../../redux/slices/setUploadPodcast';
import { useEffect } from 'react';

const DialogContainer = styled.div`
width:500px;
padding: 7%;
background-color: ${({ theme }) => theme.card};
color: ${({ theme }) => theme.text_primary};
@media (max-width:800px) {
    width:360px ;
}
`

const Title = styled.div`
margin-bottom: 20px;
display: flex;
justify-content: space-between;
align-items: center;
font-size: 22px;
color: ${({ theme }) => theme.text_primary};
`;
const Heading = styled.div`
color: ${({ theme }) => theme.text_secondary};
margin-bottom: 15px;
font-size: 17px;
`

const DialogButton = styled.button`
width: 100%;
padding:10px 0px;
display:flex;
flex-direction:row;
justify-content:flex-start;
font-size: 16px;
align-items:center;
gap:12px;
cursor:pointer;
color:${({ theme }) => theme.text_secondary};
&:hover{
    color: ${({ theme }) => theme.hover};
    background: ${({ theme }) => theme.button_text}
}
`

const ThumbNail = styled.div`
position: relative;
width: 75%;
height: 130px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border: 2px dashed ${({ theme }) => theme.text_secondary};
border-radius: 8px;
text-align: center;
color: ${({ theme }) => theme.text_secondary};
cursor: pointer;
margin-bottom: 15px;
`
const ThumbNailImg = styled.img`
border-radius: 10px;
height: 126px;
width: 100%;
object-fit: contain;
position: absolute;
border: none;
box-shadow: none; /* Remove any box shadow */
outline: none; /* Remove any outline */
`

const InputBox = styled.div`
margin-bottom: 10px;
padding: 5px;
border-radius: 10px;
border: 1px solid ${({ theme }) => theme.text_secondary} !important;
`
const Input = styled.input`
height:35px;
font-size: 14px;
color: ${({ theme }) => theme.text_secondary};
background-color: transparent;
width: 100%;
outline: none;
&:active {
border-color: transparent;
}
`
const DescriptionBox = styled.textarea`
margin-bottom: 3px;
font-size: 14px;
padding: 5px;
width: 100%;
border-radius: 10px;
background-color: transparent;
color: ${({ theme }) => theme.text_secondary};
border: 1px solid ${({ theme }) => theme.text_secondary} !important;
`
const Span = styled.span`
margin-top: 4px;
display: flex;
font-size: medium;
font-weight: 700;
`
const ColorSpan = styled.div`
color: ${({ theme }) => theme.primary};
margin: 0 4px ;
`
const SelectConatiner = styled.div`
display: flex;
justify-content: space-between;
font-size: 15px;
`
const Select = styled.select`
padding-left: 10px;
border: 1px solid ${({ theme }) => theme.text_secondary};
border-radius: 10px;
color: ${({ theme }) => theme.text_secondary};
background-color: transparent;
width: 49%;
height: 42px;
`
const Option = styled.option`
background-color: ${({ theme }) => theme.bg};
font-size: 14px;
border-radius: 10px;
`
const NextButton = styled.button`
border-radius: 10px;
color: ${({ theme }) => theme.text_primary};
background: ${({ theme }) => theme.button_text};
margin-top: 20px;
border: none;
width: 100%;
height: 45px;
`

const AudioVideo = styled.video`
width: 100%;
height:126px;
position: absolute;
`
const Image = styled.img`
width: 100%;
height:126px;
position: absolute;
border-radius:10px;
`
const BackButton = styled.button`
border-radius: 10px;
color: rgb(20, 133, 220);
background-color: transparent;
border: 1px solid rgb(20, 133, 220);
margin-top: 20px;
width: 100%;
height: 45px;
`
const UploadButton = styled.button`
border-radius: 10px;
color: ${({ theme }) => theme.text_primary};
background: ${({ theme }) => theme.button_text};
margin-top: 20px;
border:none;
width: 100%;
height: 45px;
`
const RemoveButton = styled.button`
border-radius: 6px;
width: max-content;
padding: 5px;
font-size: 13px;
color: white;
background-color: lightcoral;
margin-top: 10px;
`

const UploadPodcast = () => {
    const dispatch = useDispatch()
    const [next, setNext] = useState(false)
    const value = useSelector(store => store.upload.openul);
    const [open, setOpen] = useState(value);
    const [video, setVideo] = useState(false)
    const [playlist, setPlaylist] = useState(false)

    const coverImgRef = useRef(null);
    const thumbnailRefs = useRef([]);
    const audioVideoRefs = useRef([]);
    const queryClient = useQueryClient();

    const [uploadData, setUploadData] = useState({
        coverImg: '',
        podcastName: '',
        podcastDescription: '',
        podcastTags: '',
        podcastFormat: 'audio',
        podcastCategory: '',
        episodes: [
            {
                audioVideo: '',
                episodeName: '',
                episodeDescription: '',
                thumbnail: null,
                episodeCategory: '',
                episodeType: 'audio'
            }
        ]
    })


    const handleClickOpen = () => {
        dispatch(openUpload())
    };

    const handleClose = () => {
        dispatch(closeUpload())
        setNext(false);
        setVideo(false);
        setPlaylist(false)
        setUploadData(prevState => ({
            ...prevState,
            coverImg: null,
            podcastName: '',
            podcastDescription: '',
            podcastTags: '',
            podcastFormat: 'audio',
            podcastCategory: '',
            episodes: [
                {
                    audioVideo: '',
                    episodeName: '',
                    episodeDescription: '',
                    thumbnail: null,
                    episodeCategory: '',
                    episodeType: 'audio'
                }
            ]
        }))

    };

    const { mutate: playlistUpload, isPending: playlistPending } = useMutation({
        mutationFn: async ({ coverImg, podcastName, podcastDescription, podcastTags, podcastFormat, podcastCategory, episodes }) => {
            try {
                const res = await fetch(`${endPoint}/api/upload/playlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",

                    },
                    credentials: "include",
                    body: JSON.stringify({ coverImg, podcastName, podcastDescription, podcastTags, podcastFormat, podcastCategory, episodes })
                })


                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                if (data.error) throw new Error(data.error)
                console.log(data)
                return data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        onSuccess: () => {
            toast.success("Podcast uploaded successfully");
            queryClient.invalidateQueries({ queryKey: ['uploads'] })
            setUploadData(prevState => ({
                ...prevState,
                coverImg: null,
                podcastName: '',
                podcastDescription: '',
                podcastTags: '',
                podcastFormat: 'audio',
                podcastCategory: '',
                episodes: [
                    {
                        audioVideo: '',
                        episodeName: '',
                        episodeDescription: '',
                        thumbnail: null,
                        episodeCategory: '',
                        episodeType: 'audio'
                    }
                ]
            }))
        }
    })

    const submitPlaylist = (e) => {
        e.preventDefault();
        playlistUpload(uploadData)
    }

    const { mutate: singleVideoUpload, isPending: videoPending } = useMutation({
        mutationFn: async ({ episodes }) => {
            try {
                const res = await fetch(`${endPoint}/api/upload/video`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",

                    },
                    credentials: "include",
                    body: JSON.stringify({ episodes })
                })


                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                if (data.error) throw new Error(data.error)
                console.log(data)
                return data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        onSuccess: () => {
            toast.success("Podcast uploaded successfully");
            queryClient.invalidateQueries({ queryKey: ['uploads'] })
            setUploadData(prevState => ({
                ...prevState,
                episodes: [
                    {
                        audioVideo: '',
                        episodeName: '',
                        episodeDescription: '',
                        thumbnail: null,
                        episodeCategory: '',
                        episodeType: 'audio'

                    }
                ]
            }))
        }
    })

    const submitVideo = (e) => {
        e.preventDefault();
        singleVideoUpload(uploadData)
    }


    const handleEpisodeChange = (index, field, value) => {
        const updatedEpisodes = uploadData.episodes.map((episode, i) => {
            if (i === index) {
                return {
                    ...episode,
                    [field]: value
                };
            }
            return episode;
        });
        setUploadData(prevState => ({
            ...prevState,
            episodes: updatedEpisodes
        }));
        console.log(uploadData)
    };

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === "coverImg") {
                    setUploadData(prevState => ({
                        ...prevState,
                        [state]: reader.result
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const addToRefs = (el, refArray) => {
        if (el && !refArray.current.includes(el)) {
            refArray.current.push(el);
        }
    };

    const handleFileChange = (e, index, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setUploadData(prevState => {
                    const updatedEpisodes = prevState.episodes.map((episode, i) => {
                        if (i === index) {
                            return {
                                ...episode,
                                [state]: base64String,
                            };
                        }
                        return episode;
                    });
                    return {
                        ...prevState,
                        episodes: updatedEpisodes
                    };
                });
            };
            reader.readAsDataURL(file);
        }

    };

    const addNewEpisode = (e) => {
        e.preventDefault()
        setUploadData(prevState => ({
            ...prevState,
            episodes: [
                ...prevState.episodes,
                { audioVideo: null, episodeName: '', episodeDescription: '' }
            ]
        }));
    };
    const removeEpisode = (index, e) => {
        e.preventDefault()
        setUploadData(prevState => {
            const updatedEpisodes = prevState.episodes.filter((_, i) => i !== index);
            return {
                ...prevState,
                episodes: updatedEpisodes
            };
        });
    };

    const handleFormData = (e) => {
        setUploadData({ ...uploadData, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        setOpen(value);
    }, [value]);

    return (
        <React.Fragment >

            <DialogButton variant="outlined" onClick={handleClickOpen} style={{ padding: '13px 0 13px 26px' }}>
                <CloudUpload /> Upload
            </DialogButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData).entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    overflowY: 'hidden',
                    '& .MuiPaper-root': {
                        borderRadius: '16px',
                        backgroundColor: 'transparent'
                    },
                }}

            >
                {!video && <DialogContainer >
                    <Title>Select the upload type :<Close onClick={handleClose} sx={{ cursor: 'pointer' }} /></Title>
                    <div style={{ display: 'flex' }}>
                        <UploadButton className='bg-white m-2' onClick={() => { setVideo(true); setPlaylist(false) }}>One podcast</UploadButton>
                        <BackButton className='bg-white' onClick={() => { setVideo(true); setPlaylist(true) }}>Playlist</BackButton>
                    </div>
                </DialogContainer>}

                {!playlist && <div>
                    {video && <DialogContainer>
                        <Title>Upload Podcast
                            <Close onClick={handleClose} sx={{ cursor: 'pointer' }} />
                        </Title>
                        {uploadData.episodes.map((episode, index) => (
                            <div key={index}>
                                <Heading>Podcast Details:</Heading>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                    <ThumbNail onClick={() => thumbnailRefs.current[index].click()}>

                                        <Image src={episode.thumbnail} />

                                        <input
                                            type='file'
                                            hidden
                                            accept="image/*"
                                            ref={(el) => addToRefs(el, thumbnailRefs)}
                                            onChange={(e) => handleFileChange(e, index, "thumbnail")}
                                        />
                                        {!uploadData.thumbnail && <div>
                                            <CloudUpload sx={{ fontSize: '40px' }} />
                                            <Span><ColorSpan>Select</ColorSpan> Thumbnail </Span>
                                        </div>}
                                    </ThumbNail>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                    <ThumbNail onClick={() => audioVideoRefs.current[index].click()}>

                                        <AudioVideo src={episode.audioVideo} />
                                        <input
                                            type='file'
                                            hidden
                                            accept=" video/* || audio/* "
                                            ref={(el) => addToRefs(el, audioVideoRefs)}
                                            onChange={(e) => handleFileChange(e, index, "audioVideo")}
                                        />
                                        {!uploadData.audioVideo && <div>
                                            <CloudUpload sx={{ fontSize: '40px' }} />
                                            <Span><ColorSpan>Select</ColorSpan> Audio / Video </Span>
                                        </div>}
                                    </ThumbNail>
                                </div>

                                <InputBox>
                                    <Input
                                        type='text'
                                        placeholder='Episode Name*'
                                        value={episode.episodeName}
                                        onChange={(e) => handleEpisodeChange(index, 'episodeName', e.target.value)}
                                    />
                                </InputBox>
                                <DescriptionBox
                                    text='text'
                                    placeholder="Episode Description*"
                                    value={episode.episodeDescription}
                                    onChange={(e) => handleEpisodeChange(index, 'episodeDescription', e.target.value)}
                                    rows="4"
                                />

                                <SelectConatiner>
                                    <Select
                                        onChange={(e) => handleEpisodeChange(index, 'episodeType', e.target.value)}
                                        name='episodeFormat'
                                        value={episode.episodeFormat}>
                                        <Option value='audio'>Audio</Option>
                                        <Option value='video'>Video</Option>
                                    </Select>
                                    <Select
                                        onChange={(e) => handleEpisodeChange(index, 'episodeCategory', e.target.value)}
                                        name='episodeCategory'
                                        value={episode.episodeCategory}>

                                        <Option value='' disabled selected hidden>Select Category</Option>
                                        <Option value='music' >Music</Option>
                                        <Option value='movies'>Movies</Option>
                                        <Option value='comedy'>Comedy</Option>
                                        <Option value='business'>Business</Option>
                                        <Option value='gaming'>Gaming</Option>
                                        <Option value='sports'>Sports</Option>
                                        <Option value='fashion'>Fashion</Option>
                                    </Select>

                                </SelectConatiner>
                            </div>
                        ))}
                        <BackButton onClick={(e) => { setVideo(false); setPlaylist(false) }}>Previous</BackButton>
                        <UploadButton onClick={submitVideo}>
                            <div>{videoPending ? "Uploading..." : "Upload"}</div>
                        </UploadButton>
                    </DialogContainer>}

                </div>}

                {playlist &&
                    <div>
                        {!next && <DialogContainer>
                            <Title>Upload Playlist
                                <Close onClick={handleClose} sx={{ cursor: 'pointer' }} />
                            </Title>
                            <Heading>Playlist Details: </Heading>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                <ThumbNail onClick={() => coverImgRef.current.click()}>
                                    <ThumbNailImg src={uploadData.coverImg} />
                                    <input
                                        type='file'
                                        hidden
                                        accept="image/*"
                                        ref={coverImgRef}
                                        onChange={(e) => handleImgChange(e, "coverImg")}
                                    />
                                    {<div className=''>
                                        <CloudUpload sx={{ fontSize: '40px' }} />
                                        <Span>Click her to <ColorSpan> upload </ColorSpan> thumbnail</Span>
                                    </div>}
                                </ThumbNail>
                            </div>
                            <InputBox>
                                <Input
                                    placeholder='Podcast Name*'
                                    name='podcastName'
                                    onChange={handleFormData}
                                    value={uploadData.podcastName} />
                            </InputBox>

                            <DescriptionBox
                                placeholder="Podcast Description*"
                                name='podcastDescription'
                                onChange={handleFormData}
                                value={uploadData.podcastDescription}
                                rows="4" />

                            <DescriptionBox
                                placeholder="Podcast Description*"
                                name='podcastTags'
                                onChange={handleFormData}
                                value={uploadData.podcastTags}
                                rows="3" />

                            <SelectConatiner>
                                <Select onChange={handleFormData} name='podcastFormat' value={uploadData.podcastFormat}>
                                    <Option value='audio'>Audio</Option>
                                    <Option value='video'>Video</Option>
                                </Select>
                                <Select onChange={handleFormData} name='podcastCategory' value={uploadData.podcastCategory}>
                                    <Option value='' disabled selected hidden>Select Category</Option>
                                    <Option value='music' >Music</Option>
                                    <Option value='movies'>Movies</Option>
                                    <Option value='comedy'>Comedy</Option>
                                    <Option value='business'>Business</Option>
                                    <Option value='gaming'>Gaming</Option>
                                    <Option value='sports'>Sports</Option>
                                    <Option value='fashion'>Fashion</Option>
                                </Select>
                            </SelectConatiner>
                            {/* <BackButton onClick={() => { setNext(false) }}>Back</BackButton> */}
                            <BackButton onClick={(e) => { setVideo(false); setPlaylist(false) }}>Previous</BackButton>
                            <NextButton onClick={() => { setNext(true) }}>Next</NextButton>
                        </DialogContainer>}

                        {next && <DialogContainer>
                            <Title>Upload Podcast
                                <Close onClick={handleClose} sx={{ cursor: 'pointer' }} />
                            </Title>
                            {uploadData.episodes.map((episode, index) => (
                                <div key={index}>
                                    <Heading>Episode Details:</Heading>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                        <ThumbNail onClick={() => thumbnailRefs.current[index].click()}>

                                            <Image src={episode.thumbnail} />

                                            <input
                                                type='file'
                                                hidden
                                                accept=" image/* "
                                                ref={(el) => addToRefs(el, thumbnailRefs)}
                                                onChange={(e) => handleFileChange(e, index, "thumbnail")}
                                            />
                                            {!episode.thumbnail && <div>
                                                <CloudUpload sx={{ fontSize: '40px' }} />
                                                <Span><ColorSpan>Select</ColorSpan> Thumbnail </Span>
                                            </div>}
                                        </ThumbNail>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                                        <ThumbNail onClick={() => audioVideoRefs.current[index].click()}>

                                            <AudioVideo src={episode.audioVideo} />
                                            <input
                                                type='file'
                                                hidden
                                                accept=" video/* || audio/* "
                                                ref={(el) => addToRefs(el, audioVideoRefs)}
                                                onChange={(e) => handleFileChange(e, index, "audioVideo")}
                                            />
                                            {!episode.audioVideo && <div>
                                                <CloudUpload sx={{ fontSize: '40px' }} />
                                                <Span><ColorSpan>Select</ColorSpan> Audio / Video </Span>
                                            </div>}
                                        </ThumbNail>

                                    </div>

                                    <InputBox>
                                        <Input
                                            type='text'
                                            placeholder='Episode Name*'
                                            value={episode.episodeName}
                                            onChange={(e) => handleEpisodeChange(index, 'episodeName', e.target.value)}
                                        />
                                    </InputBox>
                                    <DescriptionBox
                                        text='text'
                                        placeholder="Episode Description*"
                                        value={episode.episodeDescription}
                                        onChange={(e) => handleEpisodeChange(index, 'episodeDescription', e.target.value)}
                                        rows="4"
                                    />

                                    <SelectConatiner>
                                        <Select
                                            onChange={(e) => handleEpisodeChange(index, 'episodeType', e.target.value)}
                                            name='episodeFormat'
                                            value={episode.episodeFormat}>
                                            <Option value='audio'>Audio</Option>
                                            <Option value='video'>Video</Option>
                                        </Select>
                                        <Select
                                            onChange={(e) => handleEpisodeChange(index, 'episodeCategory', e.target.value)}
                                            name='episodeCategory'
                                            value={episode.episodeCategory}>

                                            <Option value='' disabled selected hidden>Select Category</Option>
                                            <Option value='music' >Music</Option>
                                            <Option value='movies'>Movies</Option>
                                            <Option value='comedy'>Comedy</Option>
                                            <Option value='business'>Business</Option>
                                            <Option value='gaming'>Gaming</Option>
                                            <Option value='sports'>Sports</Option>
                                            <Option value='fashion'>Fashion</Option>
                                        </Select>
                                    </SelectConatiner>

                                    <div className='flex justify-end'><RemoveButton onClick={(e) => removeEpisode(index, e)}>Remove Episode</RemoveButton></div>
                                </div>
                            ))}

                            <div className='flex gap-2'>
                                <BackButton onClick={() => { setNext(false) }}>Back</BackButton>
                                <BackButton onClick={addNewEpisode}>Add New Episode</BackButton>
                            </div>

                            <UploadButton onClick={submitPlaylist}>
                                {playlistPending ? "Uploading" : "Upload"}
                            </UploadButton>


                        </DialogContainer>}
                    </div>}
            </Dialog>
        </React.Fragment>
    );
}

export default UploadPodcast