import React from "react";
import Description from '../utils/DescriptionA.jsx';
import ImageSequenceScrubber from "../utils/ImageSequenceScrubber.jsx";

export default function Rocks() {

    const title = "Procedural Terrain";
    const description = "A collection of high-detail procedural rock formations, suitable for cliffs, crags, and steep rocky environments. Fully generated in Blender with unlimited resolution scalability. Turn any shape into terrain.";

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
                scrollFactor={0.6}
            />
        </div>
    );
}