const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    content: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: "Movie",
        validate: {
            validator: function(v) {
                return Array.isArray(v) && new Set(v.map(id => id.toString())).size === v.length;
            },
            message: props => `Duplicate values found in content array: ${props.value}`
        }
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Mylist", ListSchema);
