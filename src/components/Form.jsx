import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function Form({ onAddUrl, isOpen, onClose }) {
    const [url, setUrl] = useState('');
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load data from local storage when the component mounts
        const storedData = localStorage.getItem('WebURLs');
        if (storedData) {
            setDataList(JSON.parse(storedData));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const storedData = localStorage.getItem('WebURLs');
            const existingData = storedData ? JSON.parse(storedData) : [];

            const newDataList = [...existingData, url];
            setDataList(newDataList);

            // Save the updated data list to local storage
            // localStorage.setItem('WebURLs', JSON.stringify(newDataList));

            onAddUrl(url);

            // Reset the input field
            setUrl('');
            if (dataList.length > 0) {
                toast("You have saved your data!")
            }
            onClose();

        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        let inputUrl = e.target.value;

        if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
            inputUrl = 'https://' + inputUrl;
        }
        
        setUrl(inputUrl);
    };

    useEffect(() => {
        const handleOverlayClick = (e) => {
            if (e.target.id === 'form-modal') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOverlayClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOverlayClick);
        };
    }, [isOpen, onClose]);

    return (
        <>
            <dialog open={isOpen} id="form-modal" className="modal modal-bottom sm:modal-middle bg-sky-950/50">
                <div className="modal-box bg-sky-700 text-center">
                    <form onSubmit={handleSubmit} method="dialog">
                        <label className="form-control w-10/12 mx-auto mt-6">
                            <input
                                required
                                name="url"
                                type="text"
                                placeholder="URL"
                                className="input input-bordered w-full bg-white"
                                value={url}
                                onChange={handleInputChange}
                            />
                        </label>
                        <div className="mt-8">
                            <button disabled={loading} type="submit" className={`btn w-10/12 mx-auto uppercase bg-lime-950 text-white font-3xl disabled:bg-gray-700`}>Add</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}
