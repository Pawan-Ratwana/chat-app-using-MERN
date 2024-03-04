import React from "react";
import { Link } from "react-router-dom";



const Home = ({ isLoggedIn }) => {
    // console.log("Inside home... ", isLoggedIn)
    return (

        <div className="bg-[#9be1e6] h-[92vh] ">
            <div className="bg-[#9be1e6 flex justify-center px-20 ">
                <div>

                    <h2 className=" font-semibold text-4xl text-center my-10 text-primary">Welcome to Preetal's Chat Application</h2>
                    <p className="text-[20px] my-2">                        The Preetal Chat Application is a modern and intuitive platform designed to facilitate seamless communication and collaboration among users. With its user-friendly interface and robust features, Preetal Chat offers a comprehensive solution for individuals and teams looking to connect and engage effectively.</p>
                    <p className="e text-2xl text-center mb-4">To Explore more</p>
                    {/* <Button><div><Link to='/users/sign-up' >Unlock</Link></div></Button> */}
                    <div className="flex justify-center text-xl text-white">

                        <button className="bg-blue-600 p-4 rounded-lg ">{!isLoggedIn ? <Link to='/users/sign-in'><i className="fas fa-lock"></i> Unlock to Chat</Link> : <Link to='/'>Chat With Friend</Link>}</button>
                    </div>
                </div>
            </div>
        </div>);
}

export default Home;