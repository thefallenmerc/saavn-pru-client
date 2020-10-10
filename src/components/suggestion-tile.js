import React from 'react';

export default function SuggestionTile({ suggestion, playSong }) {
    return (
        <div className="px-2 py-2 bg-white shadow rounded my-2 mx-1 flex items-center cursor-pointer hover:shadow-lg" title={"Play " + suggestion.song} onClick={() => {
            playSong(suggestion);
        }}>
            <img src={suggestion.image} className="rounded w-12 h-12 border" />
            <div className="flex-grow text-gray-800 text-xs truncate pl-2">
                <div>Song: {suggestion.song}</div>
                <div>Album: {suggestion.album}</div>
                <div>Singers: {suggestion.singers}</div>
            </div>
        </div>
    );
}