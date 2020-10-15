import React, { useState } from 'react';
import Helper from '../lib/helper';
import config from '../lib/config';
import GoogleLogin from 'react-google-login';

export default function SignInAndSync({ onSignIn, onSignInError, user, syncToServer, syncFromServer }) {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    return (
        <span className="px-4 pt-6">
            {
                user
                    ? (
                        <div className="relative"
                            onMouseLeave={() => {
                                // setIsMenuVisible(false);
                            }}
                            onMouseEnter={() => {
                                setIsMenuVisible(true);
                            }}>
                            <span
                                onClick={() => {
                                    setIsMenuVisible(!isMenuVisible);
                                }}
                                className="px-2 mx-2 py-1 cursor-pointer">{user.name}</span>
                            {
                                isMenuVisible && (
                                    <div
                                        className="bg-white rounded text-gray-800 shadow-lg py-2"
                                        style={{
                                            position: "absolute",
                                            right: "1rem",
                                            zIndex: 5
                                        }}>
                                        <div className="px-4 py-2 cursor-pointer">{user.email}</div>
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            title="Sync playlist to server"
                                            onClick={() => {
                                                syncToServer();
                                            }}>Sync to server</div>
                                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            title="Sync playlist to server"
                                            onClick={() => {
                                                syncFromServer();
                                            }}>Sync from server</div>
                                    </div>
                                )
                            }
                        </div>
                    )
                    : (
                        <GoogleLogin
                            clientId={config.googleSignInClientId}
                            buttonText="Login"
                            onSuccess={onSignIn}
                            render={renderProps => (
                                <button
                                    className={
                                        "px-2 mx-2 rounded py-1 cursor-pointer shadow "
                                        + (renderProps.disabled ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white")
                                    }
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}>Login</button>
                            )}
                            onFailure={onSignInError}
                            isSignedIn={true}
                            cookiePolicy={'single_host_origin'}
                        />
                    )
            }
        </span>
    )
}
