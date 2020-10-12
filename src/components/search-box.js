import { IconButton } from '@material-ui/core';
import Axios from 'axios';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import SuggestionTile from './suggestion-tile';
import Endpoints from '../config/endpoints';
import Loader from './loader';

export default function SearchBox({ suggestions, setSuggestions, playSong }) {

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
        playSong(song);
    }

    return (
        <div
            onMouseLeave={() => {
                clearSuggestions();
            }}
            className="pt-6 py-2 px-10 search-box">
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
                    <div className="suggestion-box rounded-lg pr-10 w-full md:w-1/2">
                        <div className="bg-white py-2 shadow-lg border">
                            {
                                isLoading
                                    ? <Loader size="24px" className="mt-2 w-full flex justify-center" />
                                    : suggestions.map(suggestion => <SuggestionTile suggestion={suggestion} playSong={selectSong} key={suggestion.id} />)
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
