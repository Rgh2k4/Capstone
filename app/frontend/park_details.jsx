"use client";

import Reviews from "./components/park_window/review_section";

export default function ParkDetails({ openButtonUpload }) {
  let wildlifePhotos = ["image_1.jpeg", "image_2.jpeg"];
  let hasImage = false;

  function checkImages(photos) {
    if (!photos[0] == "" || null) hasImage = true;
  }

  checkImages(wildlifePhotos);

  return (
    <main className="flex flex-col">
      <header className="flex flex-col border-2 pt-25 h-75">
        <h1 className="text-center">Picture</h1>
      </header>
      <section className="my-20 place-self-center">
        <h1 className="font-bold text-2xl">Ratings</h1>
      </section>
      <section className="flex flex-col items-center text-justify mb-20">
        <h1 className="font-extrabold text-2xl mb-10">
          Insert name of park here
        </h1>
        <p className="w-3/4">
          Generating random paragraphs can be an excellent way for writers to
          get their creative flow going at the beginning of the day. The writer
          has no idea what topic the random paragraph will be about when it
          appears. This forces the writer to use creativity to complete one of
          three common writing challenges. The writer can use the paragraph as
          the first one of a short story and build upon it. A second option is
          to use the random paragraph somewhere in a short story they create.
          The third option is to have the random paragraph be the ending
          paragraph in a short story. No matter which of these challenges is
          undertaken, the writer is forced to use creativity to incorporate the
          paragraph into their writing.
        </p>
      </section>
      <section className="flex flex-col items-center">
        <h1 className="font-bold text-xl mb-15">Wildlife</h1>
        <div className="flex gap-5">
          {hasImage && (
            <div>
              <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-4 space-x-8 overflow-x-auto max-h-[500px]">
                {wildlifePhotos.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={img}
                    className="w-50 h-50 bg-gray-400 rounded"
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <section className="mt-30 place-self-center">
        <button onClick={openButtonUpload}>Write a review</button>
      </section>
      <section className="flex flex-col mt-30 items-center">
        <h1 className="font-bold text-2xl mb-10">Reviews</h1>
        <div className="rounded-md p-6 w-3/4">
          <Reviews />
        </div>
      </section>
      <footer className="mt-30 mb-20 place-self-center">
        <button>Back to top</button>
      </footer>
    </main>
  );
}

