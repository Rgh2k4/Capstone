"use client";

export default function ParkDetails() {
    return (
        <main className="flex flex-col items-center">
            <header className="border-2 h-60 w-1/4 text-center pt-25">
                Picture
            </header>
            <section className="mt-20 mb-20 font-bold text-2xl">
                <h1>
                    Ratings
                </h1>
            </section>
            <section className="flex flex-col items-center text-justify mb-20">
                <h1 className="font-extrabold text-2xl mb-10">
                    Insert name of park here
                </h1>
                <p className="w-1/5"> 
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
        </main>
    );
}