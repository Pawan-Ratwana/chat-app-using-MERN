import profileImg from '../../assets/title_logo.png'

const Dashboard = () => {

    const contacts = [
        {
            name: "Jai",
            status: "Available",
            img: profileImg
        },
        {
            name: "Pawan",
            status: "Available",
            img: profileImg
        },
        {
            name: "Jaani",
            status: "Not Available",
            img: profileImg
        },
        {
            name: "Sheru",
            status: "Available",
            img: profileImg
        }
    ]

    return (<div className="w-screen flex">
        <div className="w-[25%]  h-screen bg-secondary border-r border-r-gray-500 border-1">
            <div className='flex mx-6 items-center my-6 '>
                <div className='border border-primary p-[2px] rounded-full cursor-pointer'> <img src={profileImg} alt='User Profile' width={50} height={50} className='rounded-full ' />
                </div>
                <div className='ml-6'>
                    <h3 className='text-2xl cursor-pointer'>Preetal</h3>
                    <p className='text-lg font-light'>My Account</p>
                </div>
            </div>
            <hr />
            <div>
                <div className='text-primary text-lg ml-4 mt-3'>Messages</div>
                <div>
                    {
                        contacts.map(({ name, status, img }) => {
                            return (
                                <div className='flex  items-center my-2 ml-2 py-2 border-b border-b-gray-300'>
                                    <div className='flex items-center cursor-pointer'>
                                        <div className=' p-[2px] rounded-full '> <img src={img} alt='User Profile' width={40} height={40} className='rounded-full ' />
                                        </div>
                                        <div>
                                            <h3 className='ml-4 font-[500] text-lg'>{name}</h3>
                                            <p className='ml-4 font-[450] text-sm text-gray-6000'>{status}</p>
                                        </div>



                                    </div>


                                </div>

                            )
                        })
                    }
                </div>
            </div>
        </div>


        <div className="w-[50%]  bg-white h-screen  border-r border-r-gray-500 border-1">
            <div>
                <div className='w-full  h-[55px] bg-secondary flex mt-1 p-6 items-center border-b border-b-gray-500 border-1'>
                    <div className='cursor-pointer'><img src={profileImg} alt='Profile-pic' width={40} height={40} className='rounded-full' /></div>
                    <div className='ml-4 mr-auto'>
                        <h3 className='text-lg cursor-pointer'>Pawan</h3>
                        <p className='text-sm font-light text-gray-600'>Online</p>
                    </div>
                    <div className='mr-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone" width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                        </svg>
                    </div>
                    <div className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-video" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                            <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                        </svg>
                    </div>
                </div>
                <div className='h-[75%]  w-full  overflow-y-scroll'>
                    <div className='h-[515px]  px-10 py-14'>
                        <div className=' w-[300px] bg-secondary p-2 rounded-b-xl rounded-tr-xl my-2 p-4'>You need to enable JavaScript to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-secondary rounded-b-xl rounded-tr-xl my-2 p-4'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-primary rounded-b-xl rounded-tl-xl ml-auto mt-1 p-4 text-white'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-secondary rounded-b-xl rounded-tr-xl my-2 p-4'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-primary rounded-b-xl rounded-tl-xl ml-auto mt-1 p-4 text-white'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-secondary rounded-b-xl rounded-tr-xl my-2 p-4'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-primary rounded-b-xl rounded-tl-xl ml-auto mt-1 p-4 text-white'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-secondary rounded-b-xl rounded-tr-xl my-2 p-4'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-primary rounded-b-xl rounded-tl-xl ml-auto mt-1 p-4 text-white'>You need to enable JS to run this app.You need to enable JS to run this app.</div>
                        <div className=' w-[300px] bg-secondary rounded-b-xl rounded-tr-xl my-2 p-4'>You need to enable JS to run this app.You need to enable JS to run this app.</div>


                    </div>
                    <div className="h-[68px] fixed w-[48%]  flex items-center justify-center">
                        <input type="text" placeholder="Message..." className='p-5 pl-6 mt-2 bg-primary shadow-md rounded-full w-[100%] h-[48px] mb-1 focus:ring-0 focus:border-0 outline-none' />
                        <div className='ml-[-4rem] flex items-center cursor-pointer'>SEND</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-[25%] bg-secondary h-screen ">
            <div>
                <div className='w-full  h-[55px] bg-secondary flex mt-1  p-6 items-center border-b border-b-gray-500 border-1'>
                    <h2 className='text-2xl flex items-center text-Gray-600'>Details</h2>
                </div >
                <div className=' '>
                    <h3 className='text-xl mb-4 m-6'>Members</h3>
                    <div >
                        <div className='flex bg-light '>
                            <div className='ml-6 my-3 flex '>
                                <div className='cursor-pointer '><img src={profileImg} alt='User-profile' width={40} height={40} className='rounded-full' /></div>
                                <div className='ml-2'>
                                    <h3>user_name</h3>
                                    <p>Pawan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>);
}

export default Dashboard;