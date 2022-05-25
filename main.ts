require('dotenv').config();
import SpotifyWebApi from './modules/SpotifyWebApi';

SpotifyWebApi.instance.authenticate();
