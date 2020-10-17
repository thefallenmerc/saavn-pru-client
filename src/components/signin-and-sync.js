import React, { useState } from 'react';
import Helper from '../lib/helper';
import config from '../lib/config';
import GoogleLogin from 'react-google-login';

export default function SignInAndSync({
    onSignIn,
    onSignInError,
    user,
    syncToServer,
    syncFromServer
}) {

    return (
        <span className="px-4 pt-6">
            {
                user
                    ? (
                        <div className="relative">
                            <div
                                className="px-2 mx-2 py-1 cursor-pointer">
                                {/* User Data */}
                                <div className="flex flex-col items-center">
                                    <img src={user.picture}
                                        className="rounded-full w-32 h-32 shadow-lg" alt={user.name} />
                                    <div className="font-bold text-gray-800 text-xl mt-5 text-center">
                                        {user.name}
                                    </div>
                                    <div className="text-gray-500 text-center">{user.email}</div>
                                </div>
                            </div>
                            {/* Sync Options */}
                            <div
                                className="bg-white rounded text-gray-800 py-2 px-4">
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded mb-2"
                                    title="Sync playlist to server"
                                    onClick={() => {
                                        syncToServer();
                                    }}>Sync to server</div>
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded mb-2"
                                    title="Sync playlist to server"
                                    onClick={() => {
                                        syncFromServer();
                                    }}>Sync from server</div>
                            </div>
                        </div>
                    )
                    : (
                        <div className="px-2 mx-2">
                            {/* Login Options */}
                            <div className="flex flex-col items-center">
                                <img src={"https://avatars2.githubusercontent.com/u/20546147?s=460&v=4"}
                                    className="rounded-full w-32 h-32 shadow-lg" alt={"Saavn Pru"} />
                                <div className="font-bold text-gray-800 text-xl mt-5 text-center">
                                    {"Saavn Pru"}
                                </div>
                                <div className="text-gray-500 text-center mb-3">{"thefallenmerc@gmail.com"}</div>
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
                            </div>
                        </div>
                    )
            }
        </span>
    )
}
