import axios from 'axios';

const Req = axios.create({
    baseURL: 'http://localhost:4000',
});

export default Req;
