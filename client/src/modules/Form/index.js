import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/input/input";
import { useNavigate } from "react-router-dom";

const Form = ({
    isSignInPage = false,
}) => {
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ""
        }),
        email: "",
        password: "",
        // confirm_password: ""
    })

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("data => ", data);
        const res = await fetch(`http://localhost:8000/api/users/${isSignInPage ? 'login' : 'register'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (res.status === 400) {
            alert("Invalid Credentials");
        } else {
            const resData = await res.json();
            // console.log("resData", resData)
            if (resData.token) {
                localStorage.setItem('user:token', resData.token)
                localStorage.setItem('user:detail', JSON.stringify(resData.user))
                // console.log("ResData =>  ", localStorage.setItem('user:detail', JSON.stringify(resData.user)));
                navigate('/')
                window.location.reload();
            }
        }


    }
    return (<div className="bg-[#9be1e6] h-[92vh] flex justify-center items-center">
        <div className="bg-white w-[600px] h-full border border-blue-500 flex flex-col items-center justify-center shadow-lg rounded-lg">
            <div className="text-4xl font-bold mb-4">Welcome to Preetal</div>
            <div className="text-xl font-light mb-9">{isSignInPage ? 'Sign In to get explored' : 'Sign Up now to get started'}</div>

            <form className="w-full flex flex-col  justify-center items-center" onSubmit={(e) => handleSubmit(e)}>

                {/* input for Full name  */}
                {!isSignInPage && <Input label="Full Name" name="name" placeholder="Enter your Full Name" className="mb-6" value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} />}

                {/* input for email  */}
                <Input label="Email" name="email" type="email" placeholder="Enter your Email" className="mb-6" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />

                {/* input for password  */}
                <Input label="Password" name="password" type="password" placeholder="Enter your Password" className="mb-10" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />

                {/* input for confirm password  */}
                {/* {!isSignInPage && <Input type="password" label="Conform Password" name="confirm_password" placeholder="Enter your Confirm Password" className="mb-6" value={data.confirm_password} onChange={(e) => setData({ ...data, confirm_password: e.target.value })} />} */}

                {/* submit button  */}
                <Button label={isSignInPage ? "Sign In" : "Sign Up"} type="submit" className="w-1/2 mb-3" />

            </form>

            <div>{isSignInPage ? "Didn't have an Account?" : "Already have an account?"} <span className="text-blue-500 cursor-pointer underline" onClick={() => navigate(`/users/${isSignInPage ? 'sign-up' : 'sign-in'}`)}>{isSignInPage ? "Sign-up" : "Sign-in"}</span></div>
        </div>
    </div>);
}

export default Form;