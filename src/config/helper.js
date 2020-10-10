const Helper = {
    unescape: data => {
        const span = document.createElement('span');
        span.innerHTML = data;
        return span.innerText;
    },
    formatSeconds: (timeInSeconds = 0) => {
        let minutes = parseInt(timeInSeconds / 60).toString();
        let seconds = parseInt(timeInSeconds % 60).toString();

        if (minutes.length < 2) {
            minutes = "0".repeat(2 - minutes.length) + minutes;
        }

        if (seconds.length < 2) {
            seconds = "0".repeat(2 - seconds.length) + seconds;
        }

        return minutes + ":" + seconds;
    },
    completionPercentage: (currentTime, duration) => (currentTime / duration) * 100,
}
export default Helper;