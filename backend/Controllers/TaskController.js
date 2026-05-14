const BlogModel = require("../Models/TaskModel");

const createBlog = async (req, res) => {
    const data = req.body;
    try {
        const model = new BlogModel(data);
        await model.save();
        res.status(201)
            .json({ message: 'Blog post created', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create blog post', success: false });
    }
}

const fetchAllBlogs = async (req, res) => {
    try {
        const data = await BlogModel.find({}).sort({ createdAt: -1 });
        res.status(200)
            .json({ message: 'All Blog Posts', success: true, data });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blog posts', success: false });
    }
}

const updateBlogById = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const obj = { $set: { ...body } };
        await BlogModel.findByIdAndUpdate(id, obj)
        res.status(200)
            .json({ message: 'Blog Post Updated', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update blog post', success: false });
    }
}

const deleteBlogById = async (req, res) => {
    try {
        const id = req.params.id;
        await BlogModel.findByIdAndDelete(id);
        res.status(200)
            .json({ message: 'Blog Post Deleted', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete blog post', success: false });
    }
}

module.exports = {
    createBlog,
    fetchAllBlogs,
    updateBlogById,
    deleteBlogById
}