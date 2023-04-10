# Spotify Monthly

<img src="./github/nodejs.svg"  width="32" height="32">&nbsp;&nbsp;&nbsp;<img src="./github/docker.svg"  width="32" height="32">&nbsp;&nbsp;&nbsp;<img src="./github/typescript.svg"  width="32" height="32">&nbsp;&nbsp;&nbsp;<img src="./github/mongodb.svg"  width="32" height="32">&nbsp;&nbsp;&nbsp;<img src="./github/express.svg"  width="32" height="32">

A cron job that will generate monthly playlists based on the music you add to your spotify playlists

Technologies used : Node.js, Docker, TypeScript, MongoDB, Express.js
## Usage
You need docker and docker-compose installed on your machine.

Clone this repo :
```shell
git clone https://github.com/deerflow/spotify-monthly
```

Run the command :
```shell
docker-compose up
```
Then go to [http://localhost:4000/users/login](http://localhost:4000/users/login) and login with your Spotify

Try adding a track to any of your playlists and a playlist with the current month and year should appear with your track in it within a minute

Whenever you'll add a track to a playlist, it will be added as well to this monthly playlist
