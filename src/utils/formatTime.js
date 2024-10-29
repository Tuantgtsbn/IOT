function formatTime(stringTime) {
    return stringTime.split('T')[1].split('.')[0];
}
module.exports = formatTime;