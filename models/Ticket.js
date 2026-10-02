const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Ticket must belong to a user']
    },
    title: {
      type: String,
      required: [true, 'Please provide a ticket title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a ticket description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a ticket category'],
      enum: ['Hardware', 'Software', 'Network', 'Account', 'Other'],
      default: 'Other'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  {
    timestamps: true
  }
);

// Add text index on title and description for search
ticketSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Ticket', ticketSchema);
