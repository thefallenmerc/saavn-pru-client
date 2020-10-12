import React from 'react';
import Slider from 'react-slick';

export default function RecentCarousal({ children }) {
    var newsTemplate;
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: children.length >= 4 ? 4 : children.length,
        slidesToScroll: 1,
    }
    return (
        <div>
            <Slider {...settings} arrows>
                {children}
            </Slider>
        </div>
    );
}
