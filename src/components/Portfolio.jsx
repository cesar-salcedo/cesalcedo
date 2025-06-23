import React from 'react';
import PortfolioItem from './portfolio_items/Type_a';

import img1 from '../assets/images/mouth_01.jpg';
import img2 from '../assets/images/mouth_02.jpg';
import img3 from '../assets/images/mouth_03.jpg';
import img4 from '../assets/images/mouth_04.jpg';
import img5 from '../assets/images/mouth_05.jpg';

export default function Portfolio() {
    return (
        <div>
            <PortfolioItem

                images={[img1, img2, img3, img4, img5]}
            />
            {/* Puedes repetir para más proyectos */}
        </div>
    );
}
