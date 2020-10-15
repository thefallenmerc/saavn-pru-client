import React, { useEffect, useState } from 'react';
import MusicPlayer from './components/media-player';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import RecentTile from './components/recent-tile';
import PlaylistItem from './components/playlist-item';
import RecentCarousal from './components/recent-carousel';
import SearchBox from './components/search-box';
import Sidebar from './components/sidebar';
import Axios from 'axios';
import Endpoints from './lib/endpoints';
import SignInAndSync from './components/signin-and-sync';

function App() {

  // The logged in user
  const [user, setUser] = useState(null);
  // currently playing list and its index
  const [playingList, setPlayingList] = useState(["Recent", 0]);
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
      const oldPlaylist = playlists[playlistName];
      const indexOfSongInOldList = playlists[playlistName].findIndex(s => s.id === song.id);
      if (indexOfSongInOldList < 0) {
        updatePlaylist(playlistName, [...oldPlaylist, song])
        // index at which song is added
        return oldPlaylist.length;
      } else {
        return indexOfSongInOldList;
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

  // remove a playlist from list
  const removePlaylist = playlistName => {
    // check if it exists
    if (playlistName in playlists) {
      // cannot delete recent and favorite
      if (!["Recent", "Favorite"].includes(playlistName)) {
        const oldPlaylist = { ...playlists };
        delete oldPlaylist[playlistName];
        console.log('updating', oldPlaylist)
        // if this is selected playlist, set another as selected (recent)
        updatePlaylists(oldPlaylist);
        if (selectedPlaylist === playlistName) {
          setSelectedPlaylist("Recent");
        }
      }
    }
  }

  // Play a given song
  const playSong = (playlistName, songIndex) => {
    console.log("playing", playlistName, songIndex);
    setPlayingList([playlistName, songIndex]);
    try {
      const song = playlists[playlistName][songIndex];
      if (song) {
        // add to recent if not there
        if (playlists["Recent"].findIndex(r => r.id === song.id) === -1) {
          addToPlaylist("Recent", song);
        }
      }
    } catch (e) { console.log("adding to recent failed at playSong") }
  }

  // Clear recent songs
  const clearRecents = () => {
    if (playlists["Recent"].length > 0) {
      updatePlaylist("Recent", []);
    }
  }

  // Play next song
  const nextSong = () => {
    const [playListName, songIndex] = playingList;
    // check if current index is the last index
    if (songIndex === playlists[playListName].length - 1) {
      // play the first song
      setPlayingList([playListName, 0]);
    } else {
      setPlayingList([playListName, songIndex + 1]);
    }
  };

  // Play prev song
  const prevSong = () => {
    const [playListName, songIndex] = playingList;
    // check if current index is the first index
    if (songIndex === 0) {
      // play the first song
      setPlayingList([playListName, playlists[playListName].length - 1]);
    } else {
      setPlayingList([playListName, songIndex - 1]);
    }
  };

  // google signin
  const onSignIn = googleUser => {

    Axios.get(Endpoints.signIn, {
      headers: {
        Authorization: "Bearer " + googleUser.tokenId
      }
    })
      .then(response => {
        const { user } = response.data;
        setUser(user);
        // save the user to localstorage
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch(error => {
        console.log({ error });
      })
  }

  // google signin
  const onSignInError = error => {
    console.error(error);
  }

  // sync state to server
  const syncToServer = () => {
    Axios.post(Endpoints.syncUp, {
      playlists
    }, {
      headers: {
        Authorization: "Bearer " + user.token
      }
    })
  }

  const syncFromServer = () => {
    Axios.get(Endpoints.syncDown, {
      headers: {
        Authorization: "Bearer " + user.token
      }
    })
      .then(response => {
        const { data } = response;
        updatePlaylists(data.playlists);
      })
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
        removePlaylist={removePlaylist}
        selectPlaylist={playlistName => {
          setSelectedPlaylist(playlistName);
        }} />
      {/* main area */}
      <div className="main">
        <div className="flex justify-between items-center">
          {/* Search field */}
          <SearchBox
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            addToPlaylist={addToPlaylist}
            playSong={playSong}
            onSignIn={onSignIn}
            onSignInError={onSignInError} />
          {/* Other options */}
          <SignInAndSync
            onSignIn={onSignIn}
            onSignInError={onSignInError}
            syncToServer={syncToServer}
            syncFromServer={syncFromServer}
            user={user} />
        </div>
        {/* Main Content */}
        <div className="pl-10 pt-3 flex pb-48">
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
                        playlists["Recent"].map((recent, index) => <RecentTile recent={recent} songIndex={index} playSong={playSong} key={recent.id} />)
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
                {selectedPlaylist && playlists[selectedPlaylist] ? playlists[selectedPlaylist].length : "0"} Song(s)
              </span>
              <div className="py-2">
                {
                  selectedPlaylist && playlists[selectedPlaylist]
                  && playlists[selectedPlaylist].map((song, index) => <PlaylistItem
                    song={song}
                    songIndex={index}
                    playSong={playSong}
                    key={song.id}
                    playingList={playingList}
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
            <h1 className="text-xl font-bold text-gray-800">Now Playing &gt; {playingList[0]}</h1>
            <span className="font-bold text-gray-500 text-xs">{playlists[playingList[0]].length} Song(s) on the list</span>
            <div className="py-2">
              <MusicPlayer
                song={playlists[playingList[0]][playingList[1]]}
                nextSong={nextSong}
                prevSong={prevSong}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
