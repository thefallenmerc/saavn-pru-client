import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Endpoints from './config/endpoints';
import SuggestionTile from './components/suggestion-tile';
import MusicPlayer from './components/media-player';
import Loader from './components/loader';

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
    <div className="flex justify-between">
      <div className="sidebar bg-gray-200">
        <div className="p-2">
          <input value={query}
            className="border rounded py-1 px-2 block w-full"
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
        </div>
        {
          isLoading
            ? <Loader size="24px" className="mt-2 w-full flex justify-center" />
            : suggestions.map(suggestion => <SuggestionTile suggestion={suggestion} playSong={playSong} key={suggestion.id} />)
        }
      </div>
      <MusicPlayer song={song} />
      <div className="sidebar bg-gray-200">
        <div className="py-1 px-2 block w-full uppercase font-bold flex items-center justify-between">
          <div>Recent Plays</div>
          <button className="rounded-lg px-1 shadow text-xxs uppercase text-white bg-red-500 focus:outline-none"
            onClick={() => {
              clearRecents();
            }}>clear</button>
        </div>
        <div className="suggestion-list">
          {
            recent.map(suggestion => <SuggestionTile suggestion={suggestion} playSong={playSong} key={suggestion.id} />)
          }
        </div>
      </div>
    </div>
  );
}


export default App;
