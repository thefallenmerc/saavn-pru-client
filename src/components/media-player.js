import React, { useEffect, useState } from 'react'
import Helper from '../config/helper';
import { Grid, Slider } from '@material-ui/core';

export default function MusicPlayer({ song }) {

    const [paused, setPaused] = useState(true);
    const [volume, setVolume] = useState(0.3);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [player, setPlayer] = useState(new Audio());

    // Load the song and initialize the player
    useEffect(() => {
        if (song) {
            const audioPlayer = new Audio(song.media_url);
            audioPlayer.volume = volume;
            setPlayer(audioPlayer);
        }
    }, [song]);

    useEffect(() => {
        if (player) {
            // after loading metadata
            player.onloadedmetadata = event => {
                setDuration(player.duration);
                setCurrentTime(player.currentTime);
                play();
            };

            player.onerror = error => {
                error = player.error;
                console.log("Error " + player.error.code + "; details: " + player.error.message);
                // restart the player on fragment error;
                if(error.code === 2) {
                    player.src = song.media_url + "?v=" + (new Date()).getTime();
                    player.load();
                    player.play();
                }
            }

            // on time update
            player.ontimeupdate = event => {
                setCurrentTime(event.target.currentTime);
            }
        }
        console.info("Player updated!");

        // cleanup
        return () => {
            player.pause();
            player.removeAttribute('src');
            player.load();
        };
    }, [player]);

    // If song isnt there, or src is not set, return error
    if (!song || !(player && player.src)) {
        return <span>Please choose a song!</span>;
    }

    // Set state to playing
    const play = () => {
        setPaused(false);
        return player.play();
    };

    // Set state to paused
    const pause = () => {
        setPaused(true);
        return player.pause();
    }

    const changeVolume = v => {
        player.volume = v;
        setVolume(v);
    }

    const changeCurrentTime = time => {
        player.currentTime = time;
        setCurrentTime(time);
    }

    return (
        <div className="player bg-white shadow">
            <div className="progress-bar" onClick={event => {
                const progress = event.clientX / window.innerWidth;
                changeCurrentTime(duration * progress);
            }}>
                <div className="progress" style={{ width: Helper.completionPercentage(currentTime, duration) + "%" }}></div>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between">
                    {/* Details */}
                    <div className="flex">
                        <div className="p-2">
                            <img src={song.image} style={{ width: "50px", height: "50px" }} className="rounded shadow-lg" />
                        </div>
                        <div className="px-2 flex flex-col justify-center">
                            <div className="text-sm font-semibold text-gray-800">
                                {Helper.unescape(song.song)}
                                <span className="text-gray-400 text-xxs px-2">{formatCount(song.play_count)} plays</span>
                            </div>
                            <div className="text-gray-500 text-xs">{Helper.unescape(song.singers)} · {song.label}</div>
                        </div>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center">
                        <i className="text-2xl icon icon-to-start cursor-pointer text-gray-800 hover:text-red-500" title="Play Previous" onClick={() => { play() }}></i>
                        {
                            player.paused
                                ? <i className="text-4xl icon icon-play cursor-pointer text-gray-800 hover:text-red-500" title="Play" onClick={() => { play() }}></i>
                                : <i className="text-4xl icon icon-pause cursor-pointer text-gray-800 hover:text-red-500" title="Pause" onClick={() => { pause() }}></i>
                        }
                        <i className="text-2xl icon icon-to-end cursor-pointer text-gray-800 hover:text-red-500" title="Play Next" onClick={() => { play() }}></i>
                    </div>
                    {/* More Details */}
                    <div className="flex items-center text-xs text-gray-500 px-4">
                        {/* Volume slider */}
                        <Grid item xs style={{ margin: '5px 1.25rem 0' }}>
                            <Slider
                                value={volume * 100}
                                color="primary"
                                onChange={(event, value) => {
                                    changeVolume(value / 100);
                                }} aria-labelledby="continuous-slider" style={{ width: "100px" }} />
                        </Grid>
                        {/* Time and stuff */}
                        <span>{Helper.formatSeconds(currentTime)}/{Helper.formatSeconds(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatCount(count) {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
