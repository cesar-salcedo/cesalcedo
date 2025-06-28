import React from "react";
import Description from '../utils/DescriptionA.jsx';
import ImageSequenceScrubber from "../utils/ImageSequenceScrubber.jsx";

export default function Rocks() {

    const title = "Procedural terrain";
    const description = "Highly accurate planetary models. Venus, Uranus, Neptune, and part of Saturn are hand-painted. The Sun is fully procedural. All planets include 16K to 23K PBR textures in equirectangular format. Used by Ubisoft.";

    return (
        <div style={{ marginTop: "64px" }}>
            <Description
                title={title}
                description={description}
            />

            <ImageSequenceScrubber
                // La ruta pública absoluta, como la usaría un navegador
                folderPath={"/rocks_sequence"}
                fileName="B"
                frameCount={34} // Asegúrate que este número sea correcto
                frameStep={4}
                scrollFactor={0.75}
            />
        </div>
    );
}