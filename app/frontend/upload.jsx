export default function Upload({ closeButtonUpload }) {
    return (
        <main className="flex flex-col w-240 h-200">
            <section className="flex flex-col relative">
                <h1 className="font-extrabold text-4xl text-center mt-15">Upload</h1>  
            </section>
            <section className="flex justify-center mx-10 mt-10 h-3/4 bg-gray-300 rounded-2xl">
                <div className="flex flex-col flex-initial justify-evenly w-1/2">
                    <img src="dsa" alt="Upload Image" className="border-2 self-center w-1/2 h-1/3 text-center" />
                    <p className="font-bold text-2xl self-center -mt-30">Rating</p>
                </div>
                <div className="flex flex-col flex-initial w-1/2">
                    <form onSubmit={null} className="flex flex-col items-center m-12">
                        <input type="text" placeholder="Title..." className="w-100 h-15 bg-white rounded-lg mb-7 pl-3"></input>
                        <textarea placeholder="Description..." className="resize-none w-100 h-80 bg-white rounded-lg pt-3 pl-3 mb-5"></textarea>
                        <input type="submit" value="Submit" className="m-4 bg-blue-500 hover:bg-blue-400 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all drop-shadow-md drop-shadow-gray-700"></input>
                    </form>
                </div>
            </section>
        </main>
    );
}