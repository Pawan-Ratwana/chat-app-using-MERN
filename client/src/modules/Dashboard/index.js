import { useEffect, useRef, useState } from 'react';
import profileImg from '../../assets/title_logo.png'
import { json } from 'react-router-dom';
import { io } from 'socket.io-client'

const Dashboard = () => {


    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const messageRef = useRef(null);
    // console.log('User => ', user);
    // console.log("Conversations => ", conversations)
    console.log("messages => ", messages)
    // console.log("users => ", users)

    useEffect(() => {
        setSocket(io('http://localhost:8080'));
        // console.log("connect");
    }, []);

    useEffect(() => {
        socket?.emit('addUser', user?.id);
        socket?.on('getUsers', users => {
            console.log('ActiveUsers => ', users)
        });

        socket?.on('getMessage', data => {
            console.log("data => ", data);
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, { user: data.user, message: data.message }]
            }))
        })
    }, [socket]);

    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages?.messages]);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:8000/api/users/conversation/${loggedInUser.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json();
            setConversations(resData);
        }
        fetchConversations()
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`http://localhost:8000/api/users/allUsers/${user?.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json();
            setUsers(resData);
        }
        fetchUsers()
    }, []);

    const fetchMessages = async (conversationId, receiver) => {
        if (conversationId === 'new') {
            // Check if there's an existing conversation with the receiver
            const existingConversation = conversations.find(conv => {
                console.log(conv)
                return conv.user.receiverId === receiver.receiverId;
            });

            if (existingConversation) {
                // Use the existing conversation ID
                conversationId = existingConversation.conversationId;
            } else {
                // Create a new conversation
                const res = await fetch(`http://localhost:8000/api/users/conversation`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        senderId: user?.id,
                        receiverId: receiver?.receiverId
                    })
                });
                const resData = await res.json();
                conversationId = resData.conversationId;
            }
        }

        const res = await fetch(`http://localhost:8000/api/users/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const resData = await res.json();
        setMessages({ messages: resData, receiver, conversationId });
    };


    const sendMessage = async () => {
        socket?.emit('sendMessage', {
            senderId: user?.id,
            receiverId: messages?.receiver?.receiverId,
            message,
            conversationId: messages?.conversationId
        })
        const res = await fetch(`http://localhost:8000/api/users/message`, {
            method: "POST",
            headers: {
                'Content-Type': 'Application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        });
        setMessage('');
    }



    return (<div className="w-screen flex">
        <div className="w-[25%]  h-screen bg-secondary border-r border-r-gray-500 border-1">
            <div className='flex mx-6 items-center my-6 '>
                <div className='border border-primary p-[2px] rounded-full cursor-pointer'> <img src={profileImg} alt='User Profile' width={50} height={50} className='rounded-full ' />
                </div>
                <div className='ml-6'>
                    <h3 className='text-2xl cursor-pointer'>{user?.fullName}</h3>
                    <p className='text-lg font-light'>My Account</p>
                </div>
            </div>
            <hr />
            <div className='overflow-y-scroll'>
                <div className='text-primary text-lg ml-4 mt-3'>Messages</div>
                <div>
                    {
                        conversations.length > 0 ?
                            conversations.map(({ conversationId, user }) => {
                                return (
                                    <div className='flex  items-center my-2 ml-2 py-2 border-b border-b-gray-300 '>
                                        <div className='flex items-center w-full cursor-pointer' onClick={() => {
                                            fetchMessages(conversationId, user);
                                        }}>
                                            <div className=' p-[2px] rounded-full '> <img src={profileImg} alt='User Profile' width={40} height={40} className='rounded-full ' />
                                            </div>
                                            <div>
                                                <h3 className='ml-4 font-[500] text-lg'>{user?.fullName}</h3>
                                                <p className='ml-4 font-[450] text-sm text-gray-6000'>{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }) : <div className='text-center text-lg font-semibold mt-24'>No Conversation</div>
                    }
                </div>
            </div>
        </div>

        <div className="w-[50%]  bg-white h-screen  border-r border-r-gray-500 border-1">
            <div>
                {
                    messages?.receiver?.fullName &&

                    <div className='w-full  h-[55px] bg-secondary flex mt-1 p-6 items-center border-b border-b-gray-500 border-1'>
                        <div className='cursor-pointer'><img src={profileImg} alt='Profile-pic' width={40} height={40} className='rounded-full' /></div>
                        <div className='ml-4 mr-auto'>
                            <h3 className='text-lg cursor-pointer'>{messages?.receiver?.fullName}</h3>
                            <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
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
                    // : console.log("not found")
                }
                <div className='h-[75%]  w-full  overflow-y-scroll'>
                    <div className='h-[455px]  px-10 py-14'>

                        {


                            messages?.messages?.length > 0 ? (
                                messages?.messages?.map(({ message, user: { id } = {} }) => {

                                    return (
                                        <>
                                            <div key={message._id} className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${id === user?.id ? 'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'}`}>{message}</div>
                                            <div ref={messageRef}></div>
                                        </>
                                    );
                                })
                            ) : (
                                <div className='text-center font-semibold text-lg mt-24'>No Messages OR  No Conversation</div>
                            )
                        }




                    </div>
                    {
                        messages?.receiver?.fullName &&

                        <div className="h-[68px] fixed w-[48%]  flex items-center bg-transparent justify-center">

                            <input type='text' placeholder="Message..." value={message} onChange={(e) => setMessage(e.target.value)} className='bg-primary text-white p-3 pl-6 rounded-full shadow-md w-full outline-none focus:ring-0 focus:border-0 ' />
                            <div className={`ml-[-4rem] flex items-center text-white cursor-pointer ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>SEND</div>
                        </div>
                    }
                </div>
            </div>
        </div>

        <div className="w-[25%] bg-secondary h-screen ">
            <div>

                <div className='w-full  h-[55px] bg-secondary flex mt-1  p-6 items-center border-b border-b-gray-500 border-1'>
                    <h2 className='text-2xl flex items-center text-Gray-600'>Details</h2>
                </div >
                <div className='overflow-y-scroll  '>
                    <h3 className='text-xl mb-4 m-6'>People</h3>
                    <div >
                        {
                            users.length > 0 ?
                                users.map(({ userId, user }) => {
                                    return (
                                        <div className='flex  items-center my-2 ml-2 py-2 border-b border-b-gray-300'>
                                            <div className='flex items-center w-full cursor-pointer' onClick={() => {
                                                fetchMessages('new', user);
                                            }}>
                                                <div className=' p-[2px] rounded-full '> <img src={profileImg} alt='User Profile' width={40} height={40} className='rounded-full ' />
                                                </div>
                                                <div>
                                                    <h3 className='ml-4 font-[500] text-lg'>{user?.fullName}</h3>
                                                    <p className='ml-4 font-[450] text-sm text-gray-6000'>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                }) : <div className='text-center text-lg font-semibold mt-24'>No Conversation</div>
                        }
                    </div>
                </div>

            </div>
        </div>
    </div>);
}

export default Dashboard;

