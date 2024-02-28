import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/input/input";

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

    // console.log("data => ", data)

    return (<div className="bg-white w-[600px] h-full border border-blue-500 flex flex-col items-center justify-center shadow-lg rounded-lg">
        <div className="text-4xl font-bold mb-4">Welcome to Preetal</div>
        <div className="text-xl font-light mb-9">{isSignInPage ? 'Sign In to get explored' : 'Sign Up now to get started'}</div>

        <form className="w-full flex flex-col  justify-center items-center" onSubmit={() => console.log("Submitted")}>

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

        <div>{isSignInPage ? "Didn't have an Account?" : "Already have an account?"} <span className="text-blue-500 cursor-pointer underline">{isSignInPage ? "Sign-up" : "Sign-in"}</span></div>
    </div>);
}

export default Form;