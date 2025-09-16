"use client";

export default function ParkDetails({ closeButtonOverlay, openButtonUpload }) {
    return (
        <main className="flex flex-col bg-orange-100 w-1/4 mx-250">
            <header className="flex flex-col relative">
                <div className="self-end absolute z-20">
                    <button onClick={closeButtonOverlay} className="text-2xl">
                        X
                    </button>
                </div>
                <img src="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg" alt="Picture" className="z-10 h-60" />
            </header>
            <section className="mt-20 mb-20 place-self-center">
                <h1 className="font-bold text-2xl">
                    Ratings
                </h1>
            </section>
            <section className="flex flex-col items-center text-justify mb-20">
                <h1 className="font-extrabold text-2xl mb-10">
                    Insert name of park here
                </h1>
                <p className="w-3/4"> 
                    Generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. 
                    The writer has no idea what topic the random paragraph will be about when it appears. This forces the writer to use creativity 
                    to complete one of three common writing challenges. The writer can use the paragraph as the first one of a short story and build upon it. 
                    A second option is to use the random paragraph somewhere in a short story they create. The third option is to have the random paragraph be 
                    the ending paragraph in a short story. No matter which of these challenges is undertaken, the writer is forced to use creativity to incorporate 
                    the paragraph into their writing. 
                </p>
            </section>
            <section className="flex flex-col items-center">
                <h1 className="font-bold text-xl mb-15">
                    Wildlife   
                </h1>
                <div className="flex gap-5">
                    <p className="border-2 w-40 h-40 text-center pt-15">Image 1</p>
                    <p className="border-2 w-40 h-40 text-center pt-15">Image 2</p>
                    <p className="border-2 w-40 h-40 text-center pt-15">Image 3</p>
                </div>
            </section>
            <section className="mt-30 place-self-center">
                <button onClick={openButtonUpload} className="w-50 h-13 shadow-xl">Write a review</button>
            </section>
            <section className="flex flex-col mt-30 items-center">
                <h1 className="font-bold text-2xl mb-10">
                    Reviews
                </h1>
                <div className="rounded-md bg-gray-300 w-140 h-150">

                </div>
            </section>
            <footer className="mt-30 mb-20 place-self-center">
                <button className="w-40 h-13 shadow-lg">Back to top</button>
            </footer>
        </main>
    );
}