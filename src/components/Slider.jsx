import { useRef, useState, useEffect } from 'react';
// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// react icons
import { FaCirclePlus } from "react-icons/fa6";
import { BsClockFill } from "react-icons/bs";
import { MdRestartAlt } from "react-icons/md";
import { RiRestartFill } from "react-icons/ri";
import { GiPreviousButton, GiNextButton } from "react-icons/gi";
// modals
import Form from "./Form.jsx";
import Duration from './Duration.jsx';

export default function Slider() {
    const [swiper, setSwiper] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDurationOpen, setIsModalDurationOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [autoplayDuration, setAutoplayDuration] = useState(5000);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://hobby-slider-server.vercel.app/api/config');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const jsonData = await response.json();

                setLoading(false);

                const initialData = jsonData.urls

                const storedData = localStorage.getItem('WebURLs');

                if (storedData) {
                    // If there is stored data, use it
                    setDataList(JSON.parse(storedData));
                } else {
                    // If no stored data, use the initial data from the API response
                    setDataList(initialData);

                    // Save the initial data to local storage
                    localStorage.setItem('WebURLs', JSON.stringify(initialData));
                }

                const apiAutoplayDuration = parseInt(jsonData.duration) || 5000; // Use a default value if duration is not available
                setAutoplayDuration(apiAutoplayDuration);
                localStorage.setItem('autoplayDuration', apiAutoplayDuration.toString());
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const swiperRef = useRef(null);
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    // console.log(dataList)

    const handleAddUrl = (newUrl) => {
        const storedData = localStorage.getItem('WebURLs');

        if (storedData) {
            try {
                // Parse the existing data
                const existingData = JSON.parse(storedData);
                
                setDataList([...existingData, newUrl]);

                // Update the existing data with the new URL
                const updatedData = [...existingData, newUrl ];

                // Save the updated data back to local storage
                localStorage.setItem('WebURLs', JSON.stringify(updatedData));
            } catch (error) {
                console.error('Error parsing existing data:', error.message);
            }
        }
    };

    const handleModalSave = (newDuration) => {
        setAutoplayDuration(newDuration);
    };

    // console.log(autoplayDuration)

    const handleResetLocalStorage = () => {
        // Clear local storage
        localStorage.removeItem('WebURLs');
        localStorage.removeItem('autoplayDuration');

        // Reload the app
        window.location.reload();
    };

    const handleNext = () => {
        if (swiper) {
            swiper.slideNext();
        }
    };

    const handlePrev = () => {
        if (swiper) {
            swiper.slidePrev();
        }
    };

    return (
        <div className='relative'>
            <Swiper
                onSwiper={setSwiper}
                ref={swiperRef}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: autoplayDuration,
                    disableOnInteraction: false,
                }}
                // pagination={{
                //     clickable: true,
                // }}
                // navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper"
            >
                {
                    dataList?.map((info, i) => <SwiperSlide key={i}>
                        <iframe sandbox="allow-same-origin allow-scripts allow-forms" className='w-full frame__border' src={info} allowFullScreen></iframe>
                    </SwiperSlide>)
                }
                <div className="autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>
            <div className='bg-transparent mx-auto flex justify-end items-center space-x-5 px-[20px] buttons__container'>
                {/* <div>
                    <h1 className='uppercase text-3xl'>Hobby Slider</h1>
                </div> */}
                <div className='flex space-x-6'>
                    <button className='cursor-pointer' onClick={handlePrev}>
                        <GiPreviousButton size={22} color='black' />
                    </button>
                    <button className='cursor-pointer' onClick={handleResetLocalStorage}>
                        <RiRestartFill size={26} color='black' />
                    </button>
                    <button className='cursor-pointer' onClick={() => setIsModalOpen(true)}  >
                        <FaCirclePlus size={22} color='black' />
                    </button>
                    <button className='cursor-pointer' onClick={() => setIsModalDurationOpen(true)}>
                        <BsClockFill size={22} color='black' />
                    </button>
                    <button className='cursor-pointer' onClick={handleNext}>
                        <GiNextButton size={22} color='black' />
                    </button>
                </div>
            </div>
            <Form isOpen={isModalOpen} onClose={closeModal} onAddUrl={handleAddUrl} />
            <Duration isOpen={isModalDurationOpen} onClose={() => setIsModalDurationOpen(false)} onSave={handleModalSave} />
        </div>
    )
}
