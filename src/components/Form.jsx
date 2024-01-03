import { useState } from "react"
import { toast } from "react-toastify";


export default function Form() {

    
    const handleSubmit = async (e) => {
        const form = e.target;
        const name = form.name.value;
        const url = form.url.value

        try {
            const response = await fetch('http://localhost:5000/site-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, url }),
            });
            const data = await response.json();
            console.log(data)
            if(data.insertedId) {
                toast('You have added successfully!')
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    return (
        <>
            <dialog id="form-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-sky-950 text-center">
                    <form onSubmit={handleSubmit} method="dialog">
                        <label className="form-control w-10/12 mx-auto">
                            <input required name="name" type="text" placeholder="App Name" className="input input-bordered w-full bg-white" />
                        </label>
                        <label className="form-control w-10/12 mx-auto mt-6">
                            <input required name="url" type="text" placeholder="URL" className="input input-bordered w-full bg-white" />
                        </label>
                        <div className="mt-8">

                            {/* if there is a button in form, it will close the modal */}
                            <button type="submit" className="btn w-10/12 mx-auto uppercase bg-lime-950 text-white font-3xl">Add</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}
