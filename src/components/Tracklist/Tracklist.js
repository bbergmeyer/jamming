import React from "react";


export class Tracklist extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {this.props.tracks}
            </div>
        )
    }
}