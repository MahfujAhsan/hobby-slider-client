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

// modals
import Form from "./Form.jsx";
import Duration from './Duration.jsx';

export default function Slider() {
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

                // localStorage.setItem('WebURLs', JSON.stringify(initialData));

                const storedData = localStorage.getItem('WebURLs');

                // if (!storedData) {
                //     setDataList(storedData);
                // } else {
                //     setDataList(JSON.parse(storedData));
                // }
                if (storedData) {
                    // If there is stored data, use it
                    setDataList(JSON.parse(storedData));
                } else {
                    // If no stored data, use the initial data from the API response
                    setDataList(initialData);

                    // Save the initial data to local storage
                    localStorage.setItem('WebURLs', JSON.stringify(initialData));
                }
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

    const handleAddUrl = (newUrl) => {
        // Update the state with the new URL
        // setDataList([...dataList, { url: newUrl }]);
        const storedData = localStorage.getItem('WebURLs');

        if (storedData) {
            try {
                // Parse the existing data
                const existingData = JSON.parse(storedData);

                // Update the state with the new URL
                setDataList([...dataList, newUrl]);

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

    return (
        <>
            <Swiper
                ref={swiperRef}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: autoplayDuration,
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
                        <iframe sandbox="allow-same-origin allow-scripts allow-forms" className=' w-11/12 rounded-lg frame__border' src={info} allowFullScreen></iframe>
                    </SwiperSlide>)
                }
                <div className="autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>
            <div className='rounded-b-lg bg-white border-2 border-black w-[92%] mx-auto flex justify-between items-center space-x-5 p-[9px] px-[20px] buttons__container'>
                <div>
                    <h1 className='uppercase text-3xl'>Hobby Slider</h1>
                </div>
                <div className='flex space-x-8'>
                    {/* <button>
                        <MdRestartAlt size={35} color='black' />
                    </button> */}
                    <button onClick={() => setIsModalOpen(true)}  >
                        <FaCirclePlus size={35} color='black' />
                    </button>
                    <button onClick={() => setIsModalDurationOpen(true)}>
                        <BsClockFill size={35} color='black' />
                    </button>

                </div>
            </div>
            <Form isOpen={isModalOpen} onClose={closeModal} onAddUrl={handleAddUrl} />
            <Duration isOpen={isModalDurationOpen} onClose={() => setIsModalDurationOpen(false)} onSave={handleModalSave} />
        </>
    )
}
