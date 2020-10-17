import React from 'react';
import Slider from 'react-slick';

export default function RecentCarousal({ children }) {
    var newsTemplate;
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: children.length >= 4 ? 4 : children.length,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: children.length >= 3 ? 3 : children.length,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: children.length >= 2 ? 2 : children.length,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: children.length >= 3 ? 3 : children.length,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: children.length >= 2 ? 2 : children.length,
                    slidesToScroll: 2
                }
            }
        ]
    }
    return (
        <div className="RecentCarousal">
            <Slider {...settings} arrows>
                {children}
            </Slider>
        </div>
    );
}
