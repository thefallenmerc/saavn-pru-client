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
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
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
