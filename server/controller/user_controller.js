// Import necessary modules
const User = require("../models/user");
const Conversation = require("../models/Conversation")
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the register controller function
module.exports.register = async (req, res) => {
    try {
        // Destructure required fields from request body
        const { fullName, email, password } = req.body;

        // Check if all required fields are provided
        if (!fullName || !email || !password) {
            // If any required field is missing, send a 400 Bad Request response
            return res.status(400).send("Please fill all required fields");
        } else {
            // Check if user with provided email already exists
            const isAlreadyExist = await User.findOne({ email });
            if (isAlreadyExist) {
                // If user already exists, send a 400 Bad Request response
                return res.status(400).send("User already exists");
            } else {
                // If user doesn't exist, create a new user instance
                const newUser = new User({ fullName, email });

                // Hash the password asynchronously
                bcryptjs.hash(password, 10, async (err, hashedPassword) => {
                    // Check for errors while hashing
                    if (err) {
                        console.log("Error hashing password: ", err);
                        // If error occurs, send a 500 Internal Server Error response
                        return res.status(500).send("Internal Server Error");
                    }

                    // Set the hashed password to the new user
                    newUser.password = hashedPassword;

                    // Save the user to the database
                    try {
                        await newUser.save();
                        // If user is saved successfully, send a 200 OK response
                        return res.status(200).send("User Registered Successfully");
                    } catch (err) {
                        // If error occurs while saving user, send a 500 Internal Server Error response
                        console.error("Error saving user in database: ", err);
                        return res.status(500).send("Internal Server Error");
                    }
                });
            }
        }
    } catch (err) {
        // Handle any other errors that may occur
        console.log("Error registering a user: ", err);
        // Send a 500 Internal Server Error response
        return res.status(500).send("Internal Server Error");
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            res.status(400).send("All fields are required.");
        } else {
            // Find the user with the provided email
            const user = await User.findOne({ email });

            // If user doesn't exist, send a 400 response
            if (!user) {
                return res.status(400).send("Incorrect Email or password");
            } else {
                // Validate the provided password
                const validateUser = await bcryptjs.compare(password, user.password);

                // If password is incorrect, send a 400 response
                if (!validateUser) {
                    return res.status(400).send("Incorrect Password");
                } else {
                    // Create payload for JWT token
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }

                    // Retrieve JWT secret key from environment variables
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'SECRRET_KEY';

                    // Sign the payload to generate JWT token
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        // Handle error while generating token
                        if (err) {
                            console.error("Error generating token: ", err);
                            return res.status(500).send("Internal Server Error");
                        }

                        // Update user's token in the database
                        await User.updateOne({ _id: user._id }, {
                            $set: { token }
                        })

                        // Set token to user object and save user
                        user.token = token;
                        user.save();

                        // Call next middleware
                        next();
                    })

                    // Send user object in response
                    res.status(200).json({ user });
                }
            }

        }
    } catch (err) {
        // Handle any other errors
        console.error("Error login user: ", err);
        return res.status(500).send("Internal Server Error");
    }
}


module.exports.conversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversation({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(201).send("Conversation created successfully");
    } catch (err) {
        console.error("Error in conversation: ", err);
        return res.status(500).send("Internal server error: ");
    }
}


module.exports.getConversation = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.userId;

        // Find conversations involving the user
        const conversations = await Conversation.find({ members: { $in: [userId] } });

        // Check if conversations were found
        if (!conversations || conversations.length === 0) {
            // If no conversations found, send a 404 status code with a message
            return res.status(404).send("No conversations found for the user");
        }

        const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await User.findById(receiverId);
            return ({ user: { email: user.email, fullName: user.fullName }, conversationId: conversation._id })
        }))

        // Send conversations as JSON response with a 200 status code
        res.status(200).json(conversationUserData);
    } catch (err) {
        // Log the error
        console.error("Error getting conversations: ", err);
        // Send a 500 status code with an error message
        return res.status(500).send("Internal server error");
    }
}
