import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function Carousel({ post }) {
    return (
        <Swiper
            style={{
                userSelect: 'none',
                '--swiper-navigation-size': '25px'
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
            loop={true}
            className='mySwiper'
        >
            {post.images.map((image, index) => (
                <SwiperSlide key={index}>
                    <img src={image.url} alt='' />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Carousel;
