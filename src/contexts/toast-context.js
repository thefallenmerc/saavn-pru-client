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
    const getStyle = type => {
        switch (type) {
            case 'danger':
                return 'bg-red-300';
            case 'success':
                return 'bg-green-300';
            case 'warning':
                return 'bg-orange-300';
            default:
                return 'bg-blue-300';
        }
    }
    return (
        <div className="ToastNotifier">
            {
                toasts.map(toast => {
                    return (
                        <div className={"toast items-center flex pl-4 pr-2 py-2 mt-2 rounded text-white " + getStyle(toast.type)} key={toast.timestamp}>
                            <div className="toast-body flex-grow pr-2">
                                <div className="toast-title">{toast.title}</div>
                                <div className="toast-message">{toast.message}</div>
                            </div>
                            <IconButton className="focus:outline-none" title="Clear Toast"
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