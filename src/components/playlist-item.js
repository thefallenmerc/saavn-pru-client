import React from 'react';
import Helper from '../config/helper';
import { Favorite } from '@material-ui/icons'

export default function PlaylistItem({ song, playSong }) {
    return (
        <div className="px-2 py-2 bg-white playlist-item rounded my-3 flex items-center cursor-pointer hover:shadow-lg" title={"Play " + song.song} onClick={() => {
            playSong(song);
        }}>
            <span className="font-bold mx-3">01</span>
            <img src={song.image} className="rounded w-12 h-12 border" />
            <i className="icon icon-play text-gray-300 mx-1"></i>
            <div className="font-bold truncate w-56 flex-grow pr-3 flex-shrink-0">{song.song}</div>
            <div className="text-gray-500 font-semibold w-48 truncate flex-shrink-0">{song.singers}</div>
            <div className="text-gray-500 font-semibold w-24">{Helper.formatSeconds(song.duration)}</div>
            <div className="text-gray-500 font-semibold w-10">
                <Favorite htmlColor={song.isFavorite ? "red": "#ddd"} className="favorite-maker" />
            </div>
        </div>
    );
}