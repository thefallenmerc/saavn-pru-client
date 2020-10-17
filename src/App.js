import React, { useEffect, useState } from 'react';
import MusicPlayer from './components/media-player';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { MusicNote, Menu as MenuIcon } from '@material-ui/icons';
import RecentTile from './components/recent-tile';
import PlaylistItem from './components/playlist-item';
import RecentCarousal from './components/recent-carousel';
import SearchBox from './components/search-box';
import Sidebar from './components/sidebar';
import Axios from 'axios';
import Endpoints from './lib/endpoints';
import { ToastContext, ToastNotifier } from './contexts/toast-context';

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
  // toaster
  const [toasts, setToasts] = useState([]);
  let listeners = [];
  // sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // music player
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);

  // Add new playlist to list
  const addPlaylist = (playlistName, playlistContent = []) => {
    const newPlaylists = { ...playlists, [playlistName]: playlistContent };
    updatePlaylists(newPlaylists);
    addToast("Added playlist \"" + playlistName + "\"");
  }

  // Update an existing playing with new song list
  const updatePlaylist = (playlistName, playlistContent = []) => {
    console.log('updating', { ...playlists, [playlistName]: playlistContent })
    updatePlaylists({ ...playlists, [playlistName]: playlistContent });
    addToast("Updated " + playlistName);
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
        if (playlistName !== "Recent") {
          addToast("Added " + song.song + " to " + playlistName);
        }
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
        addToast("Removed " + song.song + " from " + playlistName);
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
        addToast("Removed playlist \"" + playlistName + "\"!");
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
      addToast("Cleared \"Recent\"");
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
    addToast("Playing next song");
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
    addToast("Playing previous song");
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
        addToast("Signed in as " + user.name, "", "success");
      })
      .catch(error => {
        addToast("Couldn't auto signin!", "", "danger");
        console.log({ error });
      })
  }

  // google signin
  const onSignInError = error => {
    console.error(error);
    addToast("Could not sign you in!");
  }

  // sync state to server
  const syncToServer = () => {
    addToast("Sync to server initiated");
    Axios.post(Endpoints.syncUp, {
      playlists
    }, {
      headers: {
        Authorization: "Bearer " + user.token
      }
    })
      .then(response => {
        addToast("Synced to server", "", "success");
      }).catch(error => {
        addToast("Couldn't sync to server!");
        console.error(error);
      })
  }

  const syncFromServer = () => {
    addToast("Sync from server initiated");
    Axios.get(Endpoints.syncDown, {
      headers: {
        Authorization: "Bearer " + user.token
      }
    })
      .then(response => {
        const { data } = response;
        updatePlaylists(data.playlists);
        addToast("Synced from server", "", "success");
      })
      .catch(error => {
        addToast("Couldn't sync from server!");
        console.error(error);
      })
  }



  const addToast = (title = '', message = '', type = 'default') => {
    const toast = { title, message, type, timestamp: (new Date()).getTime() + Math.random() };
    setToasts([...toasts, toast]);
    listeners.push(setTimeout(() => {
      removeToast(toast);
    }, 3000));
  }

  const removeToast = toast => {
    const newToast = [...toasts];
    newToast.splice(newToast.find(t => t.timestamp === toast.timestamp), 1);
    setToasts(newToast);
  }

  const closeSidebar = _ => {
    setIsSidebarOpen(false);
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

  useEffect(() => {
    // toaster cleanup
    return () => {
      listeners.forEach(l => {
        clearTimeout(l);
      })
    }
  }, []);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast
    }}>
      <div className="App bg-gray-100">
        {/* sidebar */}
        <Sidebar
          // Signin and Sync related
          onSignIn={onSignIn}
          onSignInError={onSignInError}
          syncToServer={syncToServer}
          syncFromServer={syncFromServer}
          user={user}
          // Playlist related
          playlists={playlists}
          addPlaylist={addPlaylist}
          selectedPlaylist={selectedPlaylist}
          removePlaylist={removePlaylist}
          selectPlaylist={playlistName => {
            setSelectedPlaylist(playlistName);
          }}
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        />
        {/* main area */}
        <div className={"main animated " + (isSidebarOpen ? "" : "sidebar-closed")}>
          <div className="top-bar animated flex box-border justify-start items-center p-2 md:pt-6">
            <div className="mr-2">
              {
                isSidebarOpen
                  ? (
                    <IconButton
                      className="focus:outline-none"
                      onClick={() => { setIsSidebarOpen(!isSidebarOpen) }}>
                      <CloseIcon />
                    </IconButton>
                  )
                  : (
                    <IconButton
                      className="focus:outline-none"
                      onClick={() => { setIsSidebarOpen(!isSidebarOpen) }}>
                      <MenuIcon />
                    </IconButton>
                  )
              }
            </div>
            {/* Search field */}
            <SearchBox
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              addToPlaylist={addToPlaylist}
              playSong={playSong}
              playingList={playingList}
              selectedPlaylist={selectedPlaylist}
              playlists={Object.keys(playlists)}
              removeFromPlaylist={removeFromPlaylist}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              isMusicPlayerVisible={isMusicPlayerVisible}
              setIsMusicPlayerVisible={setIsMusicPlayerVisible}
            />
            {/* Music icon */}
            <div className="ml-2 md:hidden">
              <IconButton
                className="focus:outline-none"
                onClick={() => {
                  setIsMusicPlayerVisible(!isMusicPlayerVisible)
                }}>
                <MusicNote />
              </IconButton>
            </div>
          </div>
          {/* Main Content */}
          <div className="px-2 md:pl-10 md:pr-0 pt-3 md:flex pb-48">
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
                    && playlists[selectedPlaylist].map((song, index) => (
                      <PlaylistItem
                        song={song}
                        songIndex={index}
                        playSong={playSong}
                        key={song.id}
                        playingList={playingList}
                        selectedPlaylist={selectedPlaylist}
                        playlists={Object.keys(playlists)}
                        addToPlaylist={addToPlaylist}
                        removeFromPlaylist={removeFromPlaylist}
                      />
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="md:w-2/5 w-full px-5">
              <h1 className="text-xl md:block hidden font-bold text-gray-800">Now Playing &gt; {playingList[0]}</h1>
              <span className="font-bold md:block hidden text-gray-500 text-xs">{playlists[playingList[0]].length} Song(s) on the list</span>
              <div className="py-2">
                <MusicPlayer
                  song={playlists[playingList[0]][playingList[1]]}
                  nextSong={nextSong}
                  prevSong={prevSong}
                  isMusicPlayerVisible={isMusicPlayerVisible}
                  setIsMusicPlayerVisible={setIsMusicPlayerVisible}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastNotifier />
    </ToastContext.Provider>
  );
}


export default App;
