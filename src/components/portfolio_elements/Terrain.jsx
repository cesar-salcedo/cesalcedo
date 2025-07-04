import React from "react";
import DescriptionTypeA from '../utils/DescriptionTypeA.jsx';
import ImageSequenceScrubber from '../utils/ImageSequenceScrubber.jsx';

import descriptions from '../../data/descriptions.json';

export default function Terrain() {

    const terrainDescription = descriptions.portfolio.terrain

    return (
        <div style={{ marginTop: "64px" }}>
            <DescriptionTypeA
                title={terrainDescription.title}
                description={terrainDescription.descriptionA}
                profit={terrainDescription.descriptionB}
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