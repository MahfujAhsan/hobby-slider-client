import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function Duration({ isOpen, onClose, onSave }) {
    const [newDuration, setNewDuration] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        onSave(parseInt(newDuration, 10));
        setNewDuration('');
        onClose();
        toast(`Duration set to ${newDuration}ms`);
    };

    useEffect(() => {
        const handleOverlayClick = (e) => {
            if (e.target.id === 'duration-modal') {
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
            <dialog open={isOpen} id="duration-modal" className="modal modal-bottom sm:modal-middle bg-sky-950/50">
                <div className="modal-box bg-sky-700 text-center">
                    {/* <h2>New Autoplay Duration (ms):</h2> */}
                    <form onSubmit={handleSave} className="flex justify-center flex-col space-y-4 mt-4">
                        <label className="form-control w-10/12 mx-auto mt-6">
                            <input
                                className="input input-bordered w-full bg-white"
                                type="number"
                                value={newDuration}
                                onChange={(e) => setNewDuration(e.target.value)}
                                placeholder="New Autoplay Duration (ms):"
                                required
                            />
                        </label>
                        <button type="submit" className="btn w-10/12 mx-auto uppercase bg-lime-950 text-white font-3xl">Set Duration</button>
                    </form>
                </div>
            </dialog>
        </>
    )
}
