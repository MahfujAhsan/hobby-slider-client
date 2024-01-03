import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import { FaCirclePlus } from "react-icons/fa6";
import { BsClockFill } from "react-icons/bs";

import Form from "./Form.jsx";

export default function Slider() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        const storedData = localStorage.getItem('WebURLs');
        // if (storedData) {
        //     setDataList(JSON.parse(storedData));
        // }
        if (!storedData) {
            // Set initial data in local storage if it doesn't exist
            const initialData = [
                { url: 'https://bPlugins.com' },
                { url: 'https://google.com' },
                { url: 'https://gumroad.com' },
            ];

            localStorage.setItem('WebURLs', JSON.stringify(initialData));
            setDataList(initialData);
        } else {
            setDataList(JSON.parse(storedData));
        }
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    const handleAddUrl = (newUrl) => {
        // Update the state with the new URL
        setDataList([...dataList, { url: newUrl }]);
    };

    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper"
            >
                {
                    dataList.map((info, i) => <SwiperSlide key={i}>
                        <iframe className='border-2 border-red-700 w-10/12 rounded-lg p-2' src={info.url} height={650} allowFullScreen></iframe>
                    </SwiperSlide>)
                }
                <div className="autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>
            <div className='rounded-b-lg bg-black w-[90%] mx-auto flex justify-end space-x-5 p-[9px]'>
                <button onClick={() => document.getElementById('form-modal').showModal()} >
                    <FaCirclePlus size={35} color='white' />
                </button>
                <button>
                    <BsClockFill size={35} color='white' />
                </button>
            </div>
            <Form isOpen={isModalOpen} onClose={closeModal} onAddUrl={handleAddUrl} />
        </>
    )
}
