import React from 'react';
import Description from '../utils/DescriptionA.jsx';
import HorizontalScroll from '../utils/HorizontalScroll.jsx';



export default function TypeA({
    title,
    description,
    profit,
    images,
    isDesktop = false
}) {
    return (
        <div style={{
            marginTop: "32px"
        }}>
            <Description
                title={title}
                description={description}
                profit={profit}
            />
            <HorizontalScroll
                images={images}
                isDesktop={isDesktop}
            />

        </div>
    );
}
