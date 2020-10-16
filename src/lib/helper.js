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
    downloadJson: (filename, json) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, null, 4)));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },
    downloadSong: (song) => {
        var element = document.createElement('a');
        element.setAttribute('href', song.media_url);
        element.setAttribute('target', "_blank");
        element.setAttribute('download', song.song + ".mp4");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    },
}
export default Helper;