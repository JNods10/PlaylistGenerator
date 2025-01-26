import React, {useEffect, useState} from 'react'
import styles from "./WebPlayback.module.css"


export const WebPlayback = (props) => {

    const track = {
        name: "",
        album: {
            images: [
                {url: ""}
            ]
        },
        artists:[
            {name: ""}
        ]
    }

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(true);
    const [current_track, setTrack] = useState(track);


    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    if (!is_active) { 
        return (
            <>
                <div className={styles.container}>
                    <div className={styles.mainWrapper}>
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className={styles.container}>
                    <div className={styles.mainWrapper}>

                        <img src={current_track.album.images[0].url} className={styles.nowPlayingCover} alt="" />

                        <div className={styles.nowPlayingSide}>
                            <div className={styles.nowPlayingName}>{current_track.name}</div>
                            <div className={styles.nowPlayingArtist}>{current_track.artists[0].name}</div>

                            <button className={styles.btnSpotify} onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className={styles.btnSpotify} onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className={styles.btnSpotify} onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback