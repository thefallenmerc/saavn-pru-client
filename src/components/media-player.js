import React from 'react'

export default function MusicPlayer({ song }) {
    if (!song) {
        return <span>Please choose a song!</span>;
    }
    return (
        <div className="flex-grow p-5">
            <div className="flex">
                <div className="p-2">
                    <img src={song.image} style={{ width: "150px", height: "150px" }} className="rounded shadow-lg" />
                </div>
                <div className="flex-grow px-2 pt-5">
                    <div className="text-xs text-gray-400">:{song.id}</div>
                    <div className="text-2xl font-bold text-gray-800">{song.song}</div>
                    <div className="text-gray-500">by {song.singers} · {formatCount(song.play_count)} plays</div>
                    <div className="text-gray-500">{song.label}</div>
                </div>
            </div>
            <audio className="hover:outline-none focus:outline-none w-full mt-5" autoPlay src={song.media_url} controls />
        </div>
    )
}

function formatCount(count) {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
