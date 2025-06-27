import React from "react";
import Description from '../utils/DescriptionA.jsx';

import VideoScrubber from '../utils/VideoScrubber.jsx'
import video from '../../assets/images/rock_video05.mp4';



export default function Rocks({
    title,
    description,
    isDesktop = false,
}) {




    return (
        <div style={{ marginTop: "64px" }}>
            <Description
                title={title}
                description={description}

            />


            <VideoScrubber
                src={video}
                scrollFactor={2}
            />

        </div>
    );
}
