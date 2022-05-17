import React from "react";
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {isPlaying: false};
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }
    audio = new Audio(this.props.track.trackPreview);
    
    renderAction() {
        if (this.props.isRemoval) {
             return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } else {
             return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track)
    }

    removeTrack() {
        this.props.onRemove(this.props.track)
    }
    handlePlay() {
        if (!this.state.isPlaying) {
            this.audio.play()
            this.setState({isPlaying: true})
            //document.getElementById("playPause").innerHTML = '\u25B6'
        } else {
            this.audio.pause()
            this.setState({isPlaying: false})
            //document.getElementById("playPause").innerHTML = '\u23F8'
        }
    }
      
    
    render() {
        return (
            <div className="Track">
                <div className="audioPlayer">
                    <img className="image" src={this.props.track.albumImage} alt="album cover" onClick={this.handlePlay} />
                    <h3 id="playPause" onClick={this.handlePlay} >{'\u23EF'}</h3>

                </div>
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album} </p>
                </div>
                {this.renderAction()}
            </div>
        )
    }
}
