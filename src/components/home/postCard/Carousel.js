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
                '--swiper-navigation-size': '25px',
                position: 'relative',
                zIndex: 0
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            loop={true}
            className='mySwiper'
        >
            {post.files.map((file, index) => (
                <SwiperSlide key={index}>
                    {(file.url && file.url.includes('/video/upload/')) || file.video ? (
                        <video controls>
                            <source src={file.url || file.video} />
                        </video>
                    ) : (
                        <img
                            src={file.url || file.imgCamera || URL.createObjectURL(file)}
                            alt='post_image'
                        />
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Carousel;
