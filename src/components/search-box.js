import { IconButton } from '@material-ui/core';
import Axios from 'axios';
import debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import SuggestionTile from './suggestion-tile';
import Endpoints from '../lib/endpoints';
import Loader from './loader';

export default function SearchBox({
    suggestions,
    setSuggestions,
    addToPlaylist,
    playSong,
    playingList,
    selectedPlaylist,
    playlists,
    removeFromPlaylist
}) {

    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const debounceQuery = useCallback(debounce(value => {
        // Search
        setIsLoading(true);
        Axios.get(Endpoints.search(value))
            .then(response => {
                setSuggestions(response.data);
                setIsLoading(false);
            })
    }, 1000), []);

    const clearSuggestions = _ => {
        setQuery("");
        setSuggestions([]);
    }

    const selectSong = song => {
        clearSuggestions();
        const songIndex = addToPlaylist("Recent", song);
        if (Number.isInteger(songIndex)) {
            // take a second and play this
            playSong("Recent", songIndex);
        }
    }

    return (
        <div
            onMouseLeave={() => {
                clearSuggestions();
            }}
            className="pt-6 py-2 px-10 search-box w-full md:w-1/2">
            <input value={query}
                className="border py-3 px-5 w-full focus:outline-none"
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
                                    clearSuggestions();
                                }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )
                        : <span></span>
            }
            {/* Suggestion list */}
            {
                suggestions.length > 0 && (
                    <div className="suggestion-box rounded-lg px-10 w-full md:w-1/2">
                        <div className="bg-white py-2 shadow-lg border">
                            {
                                isLoading
                                    ? <Loader size="24px" className="mt-2 w-full flex justify-center" />
                                    : suggestions.map(suggestion => <SuggestionTile
                                        suggestion={suggestion}
                                        playSong={selectSong}
                                        key={suggestion.id}
                                        playlists={playlists}
                                        selectedPlaylist={selectedPlaylist}
                                        addToPlaylist={addToPlaylist}
                                        removeFromPlaylist={removeFromPlaylist}
                                    />)
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
