import React, { useState } from 'react';
import Helper from '../config/helper';
import { Favorite, MoreHoriz as MoreHorizIcon } from '@material-ui/icons'
import { IconButton } from '@material-ui/core';

export default function PlaylistItem({
    song,
    playSong,
    selectedPlaylist,
    playlists,
    addToPlaylist,
    removeFromPlaylist
}) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            onMouseLeave={() => {
                if (isMenuOpen) {
                    setIsMenuOpen(false);
                }
            }}
            className="px-2 py-2 bg-white playlist-item rounded my-3 flex items-center hover:shadow-lg">
            <span className="font-bold mx-3">01</span>
            <img src={song.image} className="rounded w-12 h-12 border" />
            <i className="icon icon-play text-gray-300 mx-1"></i>
            <div title={"Play " + song.song}
                className="font-bold truncate w-56 flex-grow pr-3 flex-shrink-0 cursor-pointer"
                onClick={() => {
                    playSong(song);
                }}>{song.song}</div>
            <div className="text-gray-500 font-semibold w-48 truncate flex-shrink-0">{song.singers}</div>
            <div className="text-gray-500 font-semibold w-24">{Helper.formatSeconds(song.duration)}</div>
            <div className="text-gray-500 font-semibold w-16 cursor-pointer">
                <IconButton className="focus:outline-none" onClick={() => {
                    addToPlaylist("Favorite", song);
                }}>
                    <Favorite htmlColor={song.isFavorite ? "red" : "#ddd"}
                        className="favorite-maker" />
                </IconButton>
            </div>
            <div className="text-gray-500 font-semibold w-16 cursor-pointer relative">
                <IconButton className="focus:outline-none" onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                }}>
                    <MoreHorizIcon className="favorite-maker" />
                </IconButton>
                {/* Menu */}
                {
                    isMenuOpen && (
                        <div
                            className="playlist-item-menu bg-white shadow-lg py-2 rounded">
                            {
                                playlists.map(playlistName => (
                                    <button
                                        key={playlistName}
                                        onClick={() => {
                                            addToPlaylist(playlistName, song);
                                        }}
                                        className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200 focus:outline-none">Add to {playlistName}</button>
                                ))
                            }
                            <button className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200"
                                onClick={() => {
                                    removeFromPlaylist(selectedPlaylist, song);
                                }}>Remove</button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}