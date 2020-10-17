import React, { useState } from 'react';
import Helper from '../lib/helper';
import { Favorite, MoreHoriz as MoreHorizIcon } from '@material-ui/icons'
import { IconButton } from '@material-ui/core';

export default function PlaylistItem({
    song,
    songIndex,
    playSong,
    playingList,
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
            className="PlaylistItem px-2 py-2 bg-white playlist-item rounded my-3 flex items-center hover:shadow-lg">
            {/* Song Index */}
            <span className="font-bold mx-3 w-4 hidden md:block">{songIndex + 1}</span>
            {/* Song Image */}
            <img src={song.image} className="rounded w-12 h-12 border" alt={song.song} />
            <i className="icon icon-play text-gray-300 mx-1" style={
                selectedPlaylist === playingList[0] && songIndex === playingList[1]
                    ? { color: "red" } : {}
            }></i>
            {/* Song Name */}
            <div className="flex-grow truncate">
                <div title={"Play " + song.song}
                    className="font-bold truncate md:w-56 md:flex-grow pr-3 md:flex-shrink-0 cursor-pointer truncate"
                    onClick={() => {
                        playSong(selectedPlaylist, songIndex);
                    }}>{Helper.unescape(song.song)}</div>
                {/* Song Singer */}
                <div className="flex">
                    <div className="text-gray-500 font-semibold pr-2 truncate md:flex-shrink-0">{Helper.unescape(song.singers)}</div>
                    {/* Song Duration */}
                    <div className="text-gray-500 font-semibold md:w-24">{Helper.formatSeconds(song.duration)}</div>
                    {/* Song Fav Button */}
                </div>
            </div>
            <div className="text-gray-500 font-semibold flex-shrink-0 cursor-pointer hidden md:block">
                <IconButton className="focus:outline-none" onClick={() => {
                    addToPlaylist("Favorite", song);
                }}>
                    <Favorite htmlColor={song.isFavorite ? "red" : "#ddd"}
                        className="favorite-maker" />
                </IconButton>
            </div>
            {/* More Options */}
            <div className="text-gray-500 font-semibold flex-shrink-0 cursor-pointer relative">
                <IconButton className="focus:outline-none" onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                }}>
                    <MoreHorizIcon className="favorite-maker" />
                </IconButton>
                {/* Menu */}
                {
                    isMenuOpen && (
                        <div
                            className="item-menu bg-white shadow-lg py-2 rounded">
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
                            <button className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200 focus:outline-none"
                                onClick={() => {
                                    Helper.downloadSong(song);
                                }}>Download</button>
                            <button className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200 focus:outline-none"
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