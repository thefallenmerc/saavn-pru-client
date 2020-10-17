import React, { useState } from 'react'
import { Add as AddIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import ItemMenu from './item-menu';
import { withToast } from '../contexts/toast-context';
import SignInAndSync from './signin-and-sync';

function SidebarComponent({
    // Singin and Sync Related
    onSignIn,
    onSignInError,
    user,
    syncToServer,
    syncFromServer,
    // Playlist Related
    playlists,
    addPlaylist,
    removePlaylist,
    selectPlaylist,
    selectedPlaylist,
    addToast,
    isSidebarOpen,
    closeSidebar
}) {

    const [newPlaylistName, setNewPlaylistName] = useState("");
    // somhow selectPlaylist doesnt directly work in further subcomponents
    const safeSelectPlaylist = playlistName => {
        selectPlaylist(playlistName);
    }

    const safeRemovePlaylist = playlistName => {
        removePlaylist(playlistName);
    }

    return (
        <div className={
            "Sidebar sidebar animated bg-white pt-2 pb-10 "
            + (isSidebarOpen ? "" : "closed")
        }>
            {/* Sigin And Sync */}
            <SignInAndSync
                onSignIn={onSignIn}
                onSignInError={onSignInError}
                syncToServer={syncToServer}
                syncFromServer={syncFromServer}
                user={user} />
            {/* Playlists */}
            <div className="px-4">
                <div className="px-4 mb-5 uppercase font-bold text-gray-500">My Music</div>
                {
                    Object.keys(playlists).map(playlistName => (
                        <div
                            className={
                                "px-4 text-gray-800 flex justify-between items-center font-bold py-2 hover:bg-gray-300 my-1 rounded-lg cursor-pointer " + (playlistName === selectedPlaylist ? "bg-gray-300" : "")
                            }
                            onClick={() => {
                                selectPlaylist(playlistName);
                                closeSidebar();
                            }}
                            key={playlistName}>
                            <span>{playlistName}</span>
                            <ItemMenu onClick={e => e.stopPropagation()} small buttons={[
                                {
                                    action: () => {
                                        safeSelectPlaylist("Recent");
                                        removePlaylist(playlistName);
                                    },
                                    label: "Remove"
                                }
                            ]} />
                        </div>
                    ))
                }
                <div className="relative">
                    <input
                        className="px-4 text-gray-800 font-bold py-2 my-2 bg-gray-100 rounded-lg focus:outline-none"
                        placeholder="Add playlist..." value={newPlaylistName}
                        onKeyDown={event => {
                            if (event.key === "Enter" && event.target.value.length > 0) {
                                addPlaylist(newPlaylistName);
                                setNewPlaylistName("");
                            }
                        }}
                        onChange={event => {
                            setNewPlaylistName(event.target.value);
                        }} />
                    {
                        newPlaylistName && (
                            <IconButton size="small"
                                className="focus:outline-none"
                                onClick={
                                    () => {
                                        addPlaylist(newPlaylistName);
                                        setNewPlaylistName("");
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

const Sidebar = withToast(SidebarComponent);

export default Sidebar;
