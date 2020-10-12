import React, { useState } from 'react'
import { Add as AddIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export default function Sidebar({ playlists, addPlaylist, selectPlaylist, selectedPlaylist }) {

    const [newPlaylistName, setNewPlaylistName] = useState("");

    return (
        <div className="sidebar bg-white">
            <div className="p-10 flex flex-col items-center">
                <img src="https://avatars2.githubusercontent.com/u/20546147?s=460&v=4"
                    className="rounded-full w-32 h-32 shadow-lg" />
                <div className="font-bold text-gray-800 text-xl mt-5 text-center">Chahar</div>
                <div className="text-gray-500 text-center">chaharshubhamsingh</div>
            </div>
            <div className="px-4">
                <div className="px-4 mb-5 uppercase font-bold text-gray-500">My Music</div>
                {
                    Object.keys(playlists).map(playlistName => (
                        <div
                            className={
                                "px-4 text-gray-800 font-bold py-2 hover:bg-gray-300 my-1 rounded-lg cursor-pointer " + (playlistName === selectedPlaylist ? "bg-gray-300" : "")
                            }
                            onClick={() => {
                                selectPlaylist(playlistName);
                            }}
                            key={playlistName}>
                            {playlistName}
                        </div>
                    ))
                }
                <div className="relative">
                    <input
                        className="px-4 text-gray-800 font-bold py-2 my-2 bg-gray-100 rounded-lg focus:outline-none"
                        placeholder="Add playlist..." value={newPlaylistName} onChange={event => {
                            setNewPlaylistName(event.target.value);
                        }} />
                    {
                        newPlaylistName && (
                            <IconButton size="small"
                            className="focus:outline-none"
                            onClick={
                                () => {
                                    addPlaylist(newPlaylistName)
                                    setNewPlaylistName("")
                                }
                            }
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "13px",
                                }}>
                                <AddIcon />
                            </IconButton>
                        )
                    }
                </div>
            </div>

        </div>
    )
}