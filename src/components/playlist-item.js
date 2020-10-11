import React from 'react';

export default function PlaylistItem({ song, playSong }) {
    return (
        <div className="px-2 py-2 bg-white shadow rounded mb-2 flex items-center cursor-pointer hover:shadow-lg" title={"Play " + song.song} onClick={() => {
            playSong(song);
        }}>
            <img src={song.image} className="rounded w-12 h-12 border" />
            <div className="flex-grow text-gray-800 text-xs truncate pl-2">
                <div>Song: {song.song}</div>
                <div>Album: {song.album}</div>
                <div>Singers: {song.singers}</div>
            </div>
        </div>
    );
}