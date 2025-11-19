import { generateToken } from "../libs/generateToken.js";
import Task from "../models/task.model.js";
import logger from "../libs/logger.js";
import { paginate, formatPaginatedResponse } from "../libs/paginator.js";
import bcrypt from "bcryptjs";

export const getAllUsersTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, skip, filter, status, search } = paginate(req);

    // Add user filter
    filter.user = userId;

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Fetch tasks with pagination
    const tasks = await Task.find(filter)
      .populate("user", "username email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    logger.info("Tasks retrieved with pagination", {
      userId: userId,
      page,
      limit,
      taskCount: tasks.length,
      total,
      username: req.user.username,
      filters: { status, search }
    });

    res.status(200).json(
      formatPaginatedResponse(tasks, page, limit, total)
    );
  } catch (error) {
    logger.error("Error retrieving tasks", {
      error: error.message,
      userId: req.user._id
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskByUser = async (req, res) => {
  try {
    const { id } = req.params; // id is the user ID
    const currentUserId = req.user._id;
    const { page, limit, skip, filter, status, search } = paginate(req);

    // Add user filter
    filter.user = id;

    // Check if user is requesting their own tasks or is admin
    if (id !== currentUserId.toString() && req.user.role !== "admin") {
      logger.warn("Unauthorized task access attempt", {
        requestedUserId: id,
        currentUserId: currentUserId,
        role: req.user.role
      });
      return res.status(403).json({ message: "Forbidden - You can only view your own tasks" });
    }

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    if (total === 0) {
      logger.warn("No tasks found for user", {
        userId: id,
        currentUserId: currentUserId
      });
      return res.status(200).json(
        formatPaginatedResponse([], page, limit, 0)
      );
    }

    // Fetch tasks with pagination
    const tasks = await Task.find(filter)
      .populate("user", "username email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    logger.info("Tasks retrieved for user with pagination", {
      userId: id,
      currentUserId: currentUserId,
      page,
      limit,
      taskCount: tasks.length,
      total,
      username: req.user.username,
      filters: { status, search }
    });

    res.status(200).json(
      formatPaginatedResponse(tasks, page, limit, total)
    );
  } catch (error) {
    logger.error("Error retrieving tasks for user", {
      error: error.message,
      userId: req.params.id,
      currentUserId: req.user._id
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "Please provide title, description, and due date" });
    }

    const newTask = await Task.create({
      title,
      description,
      dueDate,
      status: status || "pending",
      user: userId
    });

    const populatedTask = await newTask.populate("user", "username email role");

    logger.info("Task created successfully", {
      taskId: newTask._id,
      userId: userId,
      username: req.user.username,
      taskTitle: title,
      user: req.user,
      task: populatedTask
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask
    });
  } catch (error) {
    logger.error("Error creating task", {
      error: error.message,
      userId: req.user._id,
      username: req.user.username
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(id);

    if (!task) {
      logger.warn("Task not found for update", {
        taskId: id,
        userId: userId
      });
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== userId.toString() && req.user.role !== "admin") {
      logger.warn("Unauthorized task update attempt", {
        taskId: id,
        userId: userId,
        taskOwnerId: task.user
      });
      return res.status(403).json({ message: "Forbidden - You don't have access to update this task" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate("user", "username email role");

    logger.info("Task updated successfully", {
      taskId: id,
      userId: userId,
      username: req.user.username,
      updatedFields: { title, description, dueDate, status }
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: populatedTask
    });
  } catch (error) {
    logger.error("Error updating task", {
      error: error.message,
      taskId: req.params.id,
      userId: req.user._id
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await Task.findById(id);

    if (!task) {
      logger.warn("Task not found for deletion", {
        taskId: id,
        userId: userId
      });
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== userId.toString() && req.user.role !== "admin") {
      logger.warn("Unauthorized task deletion attempt", {
        taskId: id,
        userId: userId,
        taskOwnerId: task.user
      });
      return res.status(403).json({ message: "Forbidden - You don't have access to delete this task" });
    }

    await Task.findByIdAndDelete(id);

    logger.info("Task deleted successfully", {
      taskId: id,
      userId: userId,
      username: req.user.username,
      taskTitle: task.title
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    logger.error("Error deleting task", {
      error: error.message,
      taskId: req.params.id,
      userId: req.user._id
    });
    res.status(500).json({ message: "Internal server error" });
  }
};