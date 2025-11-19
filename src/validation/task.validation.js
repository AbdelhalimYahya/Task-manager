import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required"
    }),
    description: Joi.string().required().messages({
        "string.empty": "Description is required",
        "any.required": "Description is required"
    }),
    dueDate: Joi.string().optional(),
    status: Joi.string().valid("pending", "in-progress", "completed").default("pending"),
    priority: Joi.string().valid("low", "medium", "high").default("medium")
});

export const updateTaskSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    dueDate: Joi.string(),
    status: Joi.string().valid("pending", "in-progress", "completed"),
    priority: Joi.string().valid("low", "medium", "high")
}).min(1);

export const validateCreateTask = (req, res, next) => {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
};

export const validateUpdateTask = (req, res, next) => {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
};
