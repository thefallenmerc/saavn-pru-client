import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Endpoints from './config/endpoints';
import SuggestionTile from './components/suggestion-tile';
import MusicPlayer from './components/media-player';
import Loader from './components/loader';
import CloseIcon from '@material-ui/icons/Close';
import { Button, IconButton } from '@material-ui/core';
import RecentTile from './components/recent-tile';
import PlaylistItem from './components/playlist-item';

const defaultSong = {
  song: "Some Song",
  singers: "Some Singer",
  play_count: 9999999,
  media_url: "",
  label: "Some Label",
  image: "https://images.unsplash.com/photo-1573247353133-0290e4606fbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
}

function App() {

  const [song, setSong] = useState(defaultSong);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);

  const playSong = song => {
    // add to recent if not there
    if (recent.findIndex(r => r.id === song.id) === -1) {
      const r = [song, ...recent];
      setRecent(r);
      localStorage.setItem('recent-songs', JSON.stringify(r));
    }
    setSong(song);
  }

  const clearRecents = () => {
    if (recent.length > 0) {
      setRecent([]);
      localStorage.setItem('recent-songs', JSON.stringify([]));
    }
  }

  useEffect(() => {
    const recentFromLocal = localStorage.getItem('recent-songs');
    if (recentFromLocal) {
      try {
        const parsed = JSON.parse(recentFromLocal);
        if (Array.isArray(parsed)) {
          setRecent(parsed);
        }
      } catch (err) { }
    }
  }, []);

  const debounceQuery = useCallback(debounce(value => {
    // Search
    setIsLoading(true);
    axios.get(Endpoints.search(value))
      .then(response => {
        setSuggestions(response.data);
        setIsLoading(false);
      })
  }, 1000), []);

  return (
    <div className="bg-gray-100">
      {/* sidebar */}
      <div className="sidebar bg-white">
        <div className="p-10 flex flex-col items-center">
          <img src="https://avatars2.githubusercontent.com/u/20546147?s=460&v=4" 
          className="rounded-full w-32 h-32 shadow-lg" />
          <div className="font-bold text-gray-800 text-xl mt-5 text-center">Chahar</div>
          <div className="text-gray-500 text-center">chaharshubhamsingh</div>
        </div>
      </div>
      {/* main area */}
      <div className="main">
        {/* Search field */}
        <div className="pt-6 py-2 px-10 search-box">
          <input value={query}
            className="border py-3 px-5 w-full md:w-1/2 focus:outline-none"
            style={
              suggestions.length > 0
                ? {
                  borderTopLeftRadius: "0.5em",
                  borderTopRightRadius: "0.5em",
                  borderBottom: "none"
                }
                : {
                  borderRadius: "2em"
                }
            }
            placeholder="Search..."
            onChange={event => {
              const { value } = event.target;
              setQuery(value);
              if (value.trim()) {
                debounceQuery(value);
              } else {
                // not show any random suggestion on clearing search field
                debounceQuery.cancel();
              }
            }} />
          {/* Clear suggestion button */}
          {
            isLoading
              ? <Loader size="24px" className="loading-suggestion" />
              : suggestions.length > 0
                ? (
                  <IconButton className="clear-suggestion focus:outline-none" title="Clear Suggestions"
                    onClick={() => {
                      setQuery("");
                      setSuggestions([]);
                    }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
                : <span></span>
          }
          {/* Suggestion list */}
          {
            suggestions.length > 0 && (
              <div className="suggestion-box rounded-lg pr-10 w-full md:w-1/2">
                <div className="bg-white py-2 shadow-lg border">
                  {
                    isLoading
                      ? <Loader size="24px" className="mt-2 w-full flex justify-center" />
                      : suggestions.map(suggestion => <SuggestionTile suggestion={suggestion} playSong={playSong} key={suggestion.id} />)
                  }
                </div>
              </div>
            )
          }
        </div>
        {/* Main Content */}
        <div className="pl-10 pt-3 flex">
          <div className="md:w-3/5 w-full">
            {/* recent */}
            <div className="pl-10 flex items-center">
              <span className="text-xl font-bold text-gray-800 mr-3">Recent Played</span>
              <IconButton typeof="danger" className="focus:outline-none" onClick={() => {
                clearRecents();
              }}><CloseIcon fontSize="small" /></IconButton>
            </div>
            <div className="pl-10 flex items-center overflow-auto">
              {
                recent.map(recent => <RecentTile recent={recent} playSong={playSong} key={recent.id} />)
              }
            </div>
            <div className="py-5">
              {/* Song List */}
              <h1 className="text-xl font-bold text-gray-800">Most Popular</h1>
              <span className="font-bold text-gray-500 text-xs">50 Songs</span>
              <div className="py-2">
                {
                  recent.map(recent => <PlaylistItem song={recent} playSong={playSong} key={recent.id} />)
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
