import React, { useState } from 'react';
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons'
import { IconButton } from '@material-ui/core';

export default function ItemMenu({ buttons = [], small = false, onClick = e => {} }) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <span
            onMouseLeave={() => {
                setIsMenuOpen(false);
            }}
            onClick={onClick}
            className="text-gray-500 font-semibold cursor-pointer relative">
            <IconButton className="focus:outline-none"
                size={small ? "small" : "medium"}
                onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                }}>
                <MoreHorizIcon className="favorite-maker" />
            </IconButton>
            {/* Menu */}
            {
                isMenuOpen && (
                    <div
                        className="item-menu bg-white shadow-lg py-2 rounded">
                        {
                            buttons.map((b, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        b.action();
                                    }}
                                    className="px-3 py-2 text-left text-sm block w-full hover:bg-gray-200 focus:outline-none">
                                    {b.label}
                                </button>
                            ))
                        }
                    </div>
                )
            }
        </span>
    )
}
