import React from "react";
import Description from '../utils/DescriptionA.jsx';
import ImageSequenceScrubber from "../utils/ImageSequenceScrubber.jsx";

export default function Rocks({ title, description }) {
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
                frameCount={133} // Asegúrate que este número sea correcto
                frameStep={4}
                scrollFactor={2}
            />
        </div>
    );
}