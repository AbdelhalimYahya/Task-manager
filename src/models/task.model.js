import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date'],
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
// taskSchema.index({ title: 'text', description: 'text' });

// // Cascade delete tasks when a user is deleted
// taskSchema.pre('remove', async function(next) {
//   await this.model('User').updateOne(
//     { _id: this.user },
//     { $pull: { tasks: this._id } }
//   );
//   next();
// });

// Add a method to check if the current user is the owner of the task
// taskSchema.methods.isOwner = function(userId) {
//   return this.user.toString() === userId.toString();
// };

const Task = mongoose.model('Task', taskSchema);

export default Task;