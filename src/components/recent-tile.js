import React from 'react';
import Helper from '../config/helper';

export default function RecentTile({ recent, songIndex, playSong }) {
    return (
        <div
            className="pr-5 cursor-pointer"
            title={"Play " + recent.song}
            onClick={() => {
                playSong("Recent", songIndex);
            }}>
            <div style={{
                height: "150px",
                width: "150px"
            }} className="mb-3">
                <img src={recent.image_500 ? recent.image_500 : recent.image} className="shadow rounded-lg" />
            </div>
            <div className="text-gray-800 text-sm truncate">
                <div className="font-bold">
                    {Helper.unescape(recent.song)}
                </div>
                <div className="text-gray-500 text-xs">
                    Album: {Helper.unescape(recent.album)}
                </div>
            </div>
        </div>
    );
}