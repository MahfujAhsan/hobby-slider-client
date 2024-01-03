import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function Form() {
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

    // console.log(dataList)

    const handleSubmit = () => {
        setLoading(true);

        try {
            const newDataList = [...dataList, { url }];
            setDataList(newDataList);

            // Save the updated data list to local storage
            localStorage.setItem('WebURLs', JSON.stringify(newDataList));

            // Reset the input field
            setUrl('');
            if (dataList) {
                toast("You have saved your data!")
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <dialog id="form-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-sky-950 text-center">
                    <form onSubmit={handleSubmit} method="dialog">
                        <label className="form-control w-10/12 mx-auto mt-6">
                            <input
                                required
                                name="url"
                                type="text"
                                placeholder="URL"
                                className="input input-bordered w-full bg-white"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
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
