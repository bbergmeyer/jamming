const redirectUri = 'http://localhost:3000'
let accessToken;
const clientId = process.env.REACT_APP_CLIENT_ID

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //this clears the parameteers
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessURL
        }

    },
    search(term) {
        const accessToken = Spotify.getAccessToken()
        const url = `https://api.spotify.com/v1/search?type=track&q=${term}`
        const header = {headers: {Authorization: `Bearer ${accessToken}`}}
        return fetch(url, header)
        .then(response => {
            return response.json()
        })
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                albumImage: track.album.images[0].url,
                trackPreview: track.preview_url
            }));
        }); 
    },

    savePlaylist(name, uris) {
        if (!name || !uris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const header = {Authorization: `Bearer ${accessToken}`};
        let userID;
        const url = 'https://api.spotify.com/v1/me';
        
        return fetch(url, {headers: header})
        .then(response => response.json())
        .then(jsonResponse => {
            userID = jsonResponse.id
            const newURL = `https://api.spotify.com/v1/users/${userID}/playlists`
            return fetch(newURL, {headers: header,
                                  method: 'POST',
                                  body: JSON.stringify({ name: name})
                                })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
                    headers: header,
                    method: 'POST',
                    body: JSON.stringify({uris: uris})
                })
            })
        })
    }    
}



export default Spotify