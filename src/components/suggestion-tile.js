import React from 'react';

export default function SuggestionTile({ suggestion, playSong }) {
    return (
        <div className="p-2 hover:bg-gray-100 animated flex items-center cursor-pointer"
            title={"Play " + suggestion.song} onClick={() => {
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