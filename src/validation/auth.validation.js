import Joi from "joi";

export const signupSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
        "any.required": "Name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be valid",
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password is required",
        "any.required": "Password is required"
    }),
    role: Joi.string().valid("user", "admin").default("user")
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be valid",
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required"
    })
});

export const validateSignup = (req, res, next) => {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
};

export const validateLogin = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
};
