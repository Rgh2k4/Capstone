"use client";
export default function Login({ handleLogin }) {

    function authenticated() {
        handleLogin();
    }

    return (
        <main className="flex flex-col items-center bg-sky-300 h-screen w-screen">
            <section className="w-256 m-16 flex-initial">
                <h1 className="text-8xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
            </section>
            <section className="border-2 border-hidden w-124 h-90 bg-white rounded-md">
                <form onSubmit={authenticated} className="flex flex-col items-center m-12">
                    <input type="text" placeholder="Enter Username..." className="w-100 h-12 pl-4 mb-12 rounded mb-3 border-black border-1 text-neutral-950"></input>
                    <input type="text" placeholder="Enter Password..." className="w-100 h-12 pl-4 mb-12 rounded mb-3 border-black border-1 text-neutral-950"></input>
                    <input type="submit" value="Log in" className="w-100 h-12 border-2 border-hidden rounded mb-3 bg-gray-300 text-3xl font-bold"></input>
                </form>
            </section>
        </main>
    );
}