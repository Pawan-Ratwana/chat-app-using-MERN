import React from "react";
import { Link } from "react-router-dom";



const Home = ({ isLoggedIn }) => {
    // console.log("Inside home... ", isLoggedIn)
    return (

        <div className="bg-[#9be1e6] h-[92vh] ">
            <div className="bg-[#9be1e6 flex justify-center ">
                <div>

                    <h2 className=" font-semibold text-4xl text-center mb-2 text-primary">Welcome to Preetal's Chat Application</h2>
                    <p>
                        The "Preetal Chat" application is a modern chat platform designed to facilitate communication and collaboration among users.</p>
                    <p>To more Explore </p>
                    {/* <Button><div><Link to='/users/sign-up' >Unlock</Link></div></Button> */}
                    <div className="flex justify-center">

                        <button className="bg-blue-600 p-2 rounded-lg ">{!isLoggedIn ? <Link to='/users/sign-in'><i className="fas fa-lock"></i> Unlock to Chat</Link> : <Link to='/'>Chat With Friend</Link>}</button>
                    </div>
                </div>
            </div>
        </div>);
}

export default Home;