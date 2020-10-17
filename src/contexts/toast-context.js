import React from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export const ToastContext = React.createContext(null);

export const withToast = Component => props => (
    <ToastContext.Consumer>
        {
            toast => <Component {...toast} {...props} />
        }
    </ToastContext.Consumer>
)

export const ToastNotifier = withToast(({ toasts, removeToast }) => {

    return (
        <div className="ToastNotifier">
            {
                toasts.map(toast => {
                    return (
                        <div className={"toast items-center flex pl-4 pr-2 py-1 mt-2 rounded text-white shadow text-xs " + (toast.type ? toast.type : "default")} key={toast.timestamp}>
                            <div className="toast-body flex-grow pr-2">
                                <div className="toast-title">{toast.title}</div>
                                <div className="toast-message">{toast.message}</div>
                            </div>
                            <IconButton className="focus:outline-none toast-close-button" title="Clear Toast"
                                onClick={() => { removeToast(toast) }}>
                                <CloseIcon fontSize="small" htmlColor="white" />
                            </IconButton>
                        </div>
                    )
                })
            }
        </div>
    );
});