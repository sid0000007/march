import { Label } from "../../models/lib/label.model.js";

const createLabel = async (labelData, user) => {
    const label = new Label({
        ...labelData,
        user
    });

    await label.save();
    if (!label) {
        const error = new Error("Failed to create the label")
        error.statusCode = 500
        throw error
    }
    return label;
}
const getLabels = async (user) => {
    const labels = await Label.find({
        user
    })
        .sort({ name: 1 })
        .exec();

    return labels;
}

const getLabel = async (id) => {
    const label = await Label.findOne({
        uuid: id
    });
    if (!label) {
        const error = new Error("Label not found")
        error.statusCode = 404
        throw error
    }
    return label;
}

const updateLabel = async (id, updatedData) => {
    const updatedLabel = await Label.findOneAndUpdate({
        uuid: id
    },
    { $set: updatedData },
    { new: true }
    )
    if (!updatedLabel) {
        const error = new Error("Failed to update Label");
        error.statusCode = 500;
        throw error;
    }
    return updatedLabel;
}

const deleteLabel = async (id, space) => {
    await Label.findOneAndDelete({
        uuid: id
    });
}

const getOrCreateLabels = async (labels, userId) => {
    const labelIds = [];

    for (const label of labels) {
        let existingLabel = await Label.findOne({
            name: label.name,
            user: userId
        });

        if (!existingLabel) {
            const newLabel = new Label({
                name: label.name,
                description: label.description || '',
                color: label.color || '',
                user: userId
            });

            existingLabel = await newLabel.save();
        }

        labelIds.push(existingLabel._id);
    }

    return labelIds;
};

export {
    createLabel,
    getLabels,
    getLabel,
    updateLabel,
    deleteLabel,
    getOrCreateLabels
}
