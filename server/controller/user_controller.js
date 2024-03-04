// Import necessary modules
const User = require("../models/user");
const Conversation = require("../models/Conversation")
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Messages = require("../models/Messages");

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

// Define the login controller function
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
                        // Send user object in response
                        return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName }, token: user.token });
                        // next();
                    })

                }
            }

        }
    } catch (err) {
        // Handle any other errors
        console.error("Error login user: ", err);
        return res.status(500).send("Internal Server Error");
    }
}

// Define the conversation controller function
module.exports.conversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        console.log("Sender : ", senderId, " , Receiver: ", receiverId)
        const newConversation = new Conversation({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(201).send("Conversation created successfully");
    } catch (err) {
        console.error("Error in conversation: ", err);
        return res.status(500).send("Internal server error: ");
    }
}

// Define the getConversation controller function
module.exports.getConversation = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.userId;

        // Find conversations involving the user
        const conversations = await Conversation.find({ members: { $in: [userId] } });

        // Check if conversations were found
        // if (!conversations || conversations.length === 0) {
        //     // If no conversations found, send a 404 status code with a message
        //     return res.status(404).send("No conversations found for the user");
        // }

        const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await User.findById(receiverId);
            return ({ user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id })
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

// Define the messages controller function
module.exports.messages = async (req, res) => {
    try {
        // Extract data from request body
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        // Check if senderId and message are provided
        if (!senderId || !message) return res.status(400).send("Please fill all required fields");

        // If conversationId is not provided and receiverId is provided, create a new conversation
        if (conversationId === 'new' && receiverId) {
            const newConversation = new Conversation({ members: [senderId, receiverId] });
            await newConversation.save();
            const newMessage = new Messages({ conversationId: newConversation._id, senderId, message })
            await newMessage.save();
            return res.status(200).send("Message sent successfully")
        } else if (!conversationId && !receiverId) {
            // If conversationId and receiverId both are not provided, send a 400 response
            return res.status(400).send("Please fill all required fields");
        }

        // Create a new message instance
        const newMessage = new Messages({ conversationId, senderId, message });

        // Save the new message to the database
        await newMessage.save();

        // Send a success response to the client
        res.status(200).send("Message sent successfully");
    } catch (err) {
        // Log and handle any errors that occur
        console.error("Error sending the message: ", err);
        // Send an error response to the client
        return res.status(500).send("Internal server error");
    }
}

// Define the getMessage controller function
module.exports.getMessage = async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            const messageUserData = await Promise.all(messages.map(async (message) => {
                const user = await User.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
            }));
            return messageUserData;
        }

        const conversationId = req.params.conversationId;

        // If conversationId is 'new', send an empty array as response
        if (conversationId === 'new') {
            const checkConversation = await Conversation.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
            if (checkConversation.length > 0) {
                const messageUserData = await checkMessages(checkConversation[0]._id);
                return res.status(200).json(messageUserData);
            } else {
                console.log("Heyy whatsapp")
                return res.status(200).json([]);
            }
        } else {
            const messageUserData = await checkMessages(conversationId);
            return res.status(200).json(messageUserData);
        }
    } catch (err) {
        // Log and handle any errors
        console.error("Error getting message: ", err);
        return res.status(500).send("Internal server error");
    }
}

// Define the allUsers controller function
module.exports.allUsers = async (req, res) => {
    try {
        const userId = req.params.userId;

        // const users = await User.find();
        const users = await User.find({ _id: { $ne: userId } });

        // Get user data
        const userData = await Promise.all(users.map(async (user) => {
            return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } }
        }))
        // Send user data as JSON response
        res.status(200).json(userData);
    } catch (err) {
        // Log and handle any errors
        console.error("Error finding all users: ", err);
        return res.status(500).send("Internal server error");
    }
}



module.exports.signOut = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.body.id;
        console.log(userId)

        // Clear the user's token from the database
        await User.findByIdAndUpdate(userId, { token: null });

        // Check if the token is removed
        const user = await User.findById(userId);
        console.log("User after sign out:", user.token);

        // Send a success response
        return res.status(200).send("User signed out successfully");
    } catch (err) {
        // Handle any errors
        console.error("Error signing out user: ", err);
        return res.status(500).send("Internal Server Error");
    }
}
