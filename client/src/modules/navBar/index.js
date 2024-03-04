import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ isLoggedIn }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));

    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/users/signOut`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(user)
            });


            if (res.status === 200) {
                localStorage.removeItem('user:token');
                localStorage.removeItem('user:detail')
                setUser('');
                navigate("/users/sign-in");
                window.location.reload();
            } else {
                console.log("Sign Out failed");
            }
        } catch (err) {
            console.log("Error to signOut the user: ", err)
        }

    }
    return (
        <div className="w-screen bg-primary m-0 h-[55px] flex items-center justify-between px-10">
            <div className="text-white text-xl">

                <Link to='/home'><i className="fas fa-home"></i></Link>
            </div>
            <div className="text-2xl font font-semibold text-white">Preetal's Chat App</div>
            <div>
                {isLoggedIn ? <button className="text-white bg-blue-700 hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center" onClick={handleSignOut}>Sign Out</button> : <Link to="/users/sign-in"> <button className="text-white bg-blue-700 hover:bg-blue focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center">Sign-In</button></Link>}
            </div>
        </div>
    );
}

export default NavBar;
