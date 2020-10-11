import React, { useEffect, useState } from 'react'
import Helper from '../config/helper';
import { Grid, IconButton, Slider } from '@material-ui/core';

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
                if (error.code === 2) {
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
        <div className="player bg-white shadow rounded-lg p-5">

            <div className="player-card px-8 text-center bg-white p-3 rounded-lg">
                {/* song art and detail */}
                <div className="beat-box mx-auto my-3 flex justify-center items-center" style={{ width: "150px", height: "150px" }}>
                    <img src={song.image} style={{ width: "150px", height: "150px" }} className={"rounded-full shadow-lg mx-auto mb-5 " + (player.paused ? "" : "heart-beat")} />
                </div>
                <div className="font-bold text-gray-800">
                    {Helper.unescape(song.song)}
                </div>
                <div className="text-gray-500 text-xs">
                    {Helper.unescape(song.singers)}
                </div>
                {/* Seeker */}
                <Slider
                    value={Helper.completionPercentage(currentTime, duration)}
                    onChange={(event, value) => {
                        changeCurrentTime(duration * (value / 100));
                    }}
                />
                {/* Time and stuff */}
                <div className="flex justify-between text-gray-500 text-xxs">
                    <span>{Helper.formatSeconds(currentTime)}</span>
                    <span>{Helper.formatSeconds(duration)}</span>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                {/* Controls */}
                <div className="flex items-center">
                    <i className="icon icon-to-start cursor-pointer text-gray-600 hover:text-red-500" title="Play Previous" onClick={() => { play() }}></i>
                    <div className="play-pause-overlay p-2 shadow rounded-full m-5">
                        {
                            player.paused
                                ? <i className="text-xl icon icon-play bg-white cursor-pointer text-gray-800 hover:bg-red-500 hover:text-white flex justify-center items-center rounded-full text-center w-10 h-10 play-button" title="Play" onClick={() => { play() }}></i>
                                : <i className="text-xl icon icon-pause bg-white cursor-pointer text-gray-800 hover:bg-red-500 hover:text-white flex justify-center items-center rounded-full text-center w-10 h-10 pause-button" title="Pause" onClick={() => { pause() }}></i>
                        }
                    </div>
                    <i className="icon icon-to-end cursor-pointer text-gray-600 hover:text-red-500" title="Play Next" onClick={() => { play() }}></i>
                </div>
                {/* More Details */}
                    {
                        false && (
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
                            </div>
                        )
                    }
                </div>
            </div>
    )
}

function formatCount(count) {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
