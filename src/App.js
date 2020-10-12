import React, { useCallback, useEffect, useState } from 'react';
import MusicPlayer from './components/media-player';
import CloseIcon from '@material-ui/icons/Close';
import { Button, IconButton } from '@material-ui/core';
import RecentTile from './components/recent-tile';
import PlaylistItem from './components/playlist-item';
import RecentCarousal from './components/recent-carousel';
import SearchBox from './components/search-box';
import Sidebar from './components/sidebar';

function App() {

  // current playing song
  const [song, setSong] = useState(null);
  // currently playing list
  const [playingList, setPlayingList] = useState("Recent");
  // current shown playlist in app
  const [selectedPlaylist, setSelectedPlaylist] = useState("Recent");
  // list of suggestions in search
  const [suggestions, setSuggestions] = useState([]);
  // the whole list of all the playlists available
  const [playlists, setPlaylists] = useState({
    "Recent": [],
    "Favorite": []
  });

  // Add new playlist to list
  const addPlaylist = (playlistName, playlistContent = []) => {
    const newPlaylists = { ...playlists, [playlistName]: playlistContent };
    updatePlaylists(newPlaylists);
  }

  // Update an existing playing with new song list
  const updatePlaylist = (playlistName, playlistContent = []) => {
    console.log('updating', { ...playlists, [playlistName]: playlistContent })
    updatePlaylists({ ...playlists, [playlistName]: playlistContent });
  }

  // save playlists object to state and localstorage
  const updatePlaylists = newPlaylists => {
    localStorage.setItem('playlists', JSON.stringify(newPlaylists));
    setPlaylists(newPlaylists);
  }

  // Add song to playlist
  const addToPlaylist = (playlistName, song) => {
    if ((playlistName in playlists)) {
      if (playlists[playlistName].findIndex(s => s.id === song.id) < 0) {
        updatePlaylist(playlistName, [...playlists[playlistName], song])
      }
    }
  }

  // Remove song from a playlist (if needed)
  const removeFromPlaylist = (playlistName, song) => {
    if ((playlistName in playlists)) {
      const index = playlists[playlistName].findIndex(s => s.id === song.id);
      if (index > -1) {
        const newPlaylist = playlists[playlistName];
        newPlaylist.splice(index, 1);
        updatePlaylist(playlistName, newPlaylist);
      }
    }
  }

  // Play a given song
  const playSong = song => {
    // add to recent if not there
    if (playlists["Recent"].findIndex(r => r.id === song.id) === -1) {
      addToPlaylist("Recent", song);
    }
    setSong(song);
  }

  const addToFav = song => {
    addToPlaylist("Favorite", song);
  }

  // Clear recent songs
  const clearRecents = () => {
    if (playlists["Recent"].length > 0) {
      playlists["Recent"] = [];
      localStorage.setItem('playlists', JSON.stringify(playlists));
      setPlaylists(playlists);
    }
  }

  // load playlists
  useEffect(() => {
    const playlistFromLocal = localStorage.getItem('playlists');
    let recentPlaylist = [];
    let favoritePlaylist = [];
    const playlistsToUpdate = {};

    try {
      const parsedPlaylists = JSON.parse(playlistFromLocal);
      // check if parsed Playlist exists
      if (parsedPlaylists && typeof parsedPlaylists === 'object') {
        if ('Recent' in parsedPlaylists) {
          recentPlaylist = parsedPlaylists.Recent;
          delete parsedPlaylists.Recent;
        }
        if ("Favorite" in parsedPlaylists) {
          favoritePlaylist = parsedPlaylists.Favorite;
          delete parsedPlaylists.Favorite;
        }
        for (const playlistName in parsedPlaylists) {
          playlistsToUpdate[playlistName] = parsedPlaylists[playlistName];
        }
      }
    } catch (err) {
    }

    playlistsToUpdate.Recent = recentPlaylist;
    playlistsToUpdate.Favorite = favoritePlaylist;
    // update playlists
    localStorage.setItem('playlists', JSON.stringify(playlistsToUpdate));
    setPlaylists(playlistsToUpdate);
  }, []);

  return (
    <div className="bg-gray-100">
      {/* sidebar */}
      <Sidebar
        playlists={playlists}
        addPlaylist={addPlaylist}
        selectedPlaylist={selectedPlaylist}
        selectPlaylist={playlistName => {
          setSelectedPlaylist(playlistName);
        }} />
      {/* main area */}
      <div className="main">
        {/* Search field */}
        <SearchBox suggestions={suggestions} setSuggestions={setSuggestions} playSong={playSong} />
        {/* Main Content */}
        <div className="pl-10 pt-3 flex">
          <div className="md:w-3/5 w-full">
            {/* recent */}
            {
              playlists["Recent"].length > 0 && (
                <div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-800 mr-3">Recent Played</span>
                    <IconButton typeof="danger" className="focus:outline-none" onClick={() => {
                      clearRecents();
                    }}><CloseIcon fontSize="small" /></IconButton>
                  </div>
                  <div className="mt-3">
                    <RecentCarousal>
                      {
                        playlists["Recent"].map(recent => <RecentTile recent={recent} playSong={playSong} key={recent.id} />)
                      }
                    </RecentCarousal>
                  </div>
                </div>
              )
            }
            <div className="py-5">
              {/* Song List */}
              <h1 className="text-xl font-bold text-gray-800">
                {selectedPlaylist ? selectedPlaylist : "No playlist selected"}
              </h1>
              <span className="font-bold text-gray-500 text-xs">
                {selectedPlaylist ? playlists[selectedPlaylist].length : "0"} Song(s)
              </span>
              <div className="py-2">
                {
                  selectedPlaylist
                  && playlists[selectedPlaylist].map(song => <PlaylistItem
                    song={song}
                    playSong={playSong}
                    key={song.id}
                    selectedPlaylist={selectedPlaylist}
                    playlists={Object.keys(playlists)}
                    addToPlaylist={addToPlaylist}
                    removeFromPlaylist={removeFromPlaylist}
                  />)
                }
              </div>
            </div>
          </div>
          <div className="md:w-2/5 w-full px-5">
            <h1 className="text-xl font-bold text-gray-800">Now Playing</h1>
            <span className="font-bold text-gray-500 text-xs">50 Songs on the list</span>
            <div className="py-2">
              <MusicPlayer song={song} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
