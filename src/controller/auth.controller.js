import { generateToken } from "../libs/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import logger from "../libs/logger.js";

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        logger.info("Signup attempt initiated", {
            email,
            name,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			logger.warn("Signup failed: Invalid email format", { email });
			return res.status(400).json({ error: "Invalid email format" });
		}

        const existingUser = await User.findOne({ email });
		if (existingUser) {
			logger.warn("Signup failed: Email already exists", { email, userId: existingUser._id });
			return res.status(400).json({ error: "Username is already taken" });
		}

        if (password.length < 6) {
			logger.warn("Signup failed: Weak password", { email });
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

        // Hashing the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            
            logger.info("User registered successfully", {
                userId: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            });
            
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            });
        } else {
            logger.error("User creation returned null", { email, name });
            res.status(400).json({ error: "User registration failed" });
        }
    } catch (error) {
        logger.error("Error in signup controller", {
            error: error.message,
            email: req.body?.email,
            errorCode: error.code,
            stack: error.stack
        });
		res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        logger.info("Login attempt initiated", {
            email,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        const user = await User.findOne({ email });
        
        if (!user) {
            logger.warn("Login failed: User not found", { email });
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            logger.warn("Login failed: Invalid password", { userId: user._id, email });
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        
        logger.info("User logged in successfully", {
            userId: user._id,
            email: user.email,
            role: user.role
        });
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        logger.error("Error in login controller", {
            error: error.message,
            email: req.body?.email,
            errorCode: error.code,
            stack: error.stack
        });
        res.status(500).json({ error: "Internal Server Error" });
    }

};

export const logout = async (req, res) => {
    try {
        logger.info("User logout initiated", {
            userId: req.user?._id,
            email: req.user?.email,
            ip: req.ip
        });
        
        res.cookie("token", "", { maxAge: 0 });
        
        logger.info("User logged out successfully", {
            userId: req.user?._id,
            email: req.user?.email
        });
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        logger.error("Error in logout controller", {
            error: error.message,
            userId: req.user?._id,
            errorCode: error.code,
            stack: error.stack
        });
        res.status(500).json({ message: "Internal Server Error" });
    }
};