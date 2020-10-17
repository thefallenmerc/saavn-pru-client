import React, { useState } from 'react';
import Helper from '../lib/helper';
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export default function SuggestionTile({
    suggestion,
    playSong,
    playlists,
    selectedPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    setIsFocused
}) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            onMouseLeave={() => {
                if (isMenuOpen) {
                    // setIsMenuOpen(false);
                }
            }}
            className="p-2 hover:bg-gray-100 animated flex items-center cursor-pointer"
        >
            <div
                title={"Play " + suggestion.song}
                className="flex items-center justify-between flex-grow"
                onClick={event => {
                    playSong(suggestion);
                    event.stopPropagation();
                    setIsFocused(false);
                }}>
                <img src={suggestion.image} className="rounded w-12 h-12 border" alt={suggestion.song} />
                <div className="flex-grow text-gray-800 text-xs truncate pl-2">
                    <div>Song: {Helper.unescape(suggestion.song)}</div>
                    <div>Album: {Helper.unescape(suggestion.album)}</div>
                    <div>Singers: {Helper.unescape(suggestion.singers)}</div>
                </div>
            </div>
            {/* More Options */}
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
                            className="item-menu bg-white shadow-lg py-2 rounded">
                            {
                                playlists.map(playlistName => (
                                    <button
                                        key={playlistName}
                                        onClick={() => {
                                            addToPlaylist(playlistName, suggestion);
                                        }}
                                        className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200 focus:outline-none">Add to {playlistName}</button>
                                ))
                            }
                            <button className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200 focus:outline-none"
                                onClick={() => {
                                    Helper.downloadSong(suggestion);
                                }}>Download</button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}