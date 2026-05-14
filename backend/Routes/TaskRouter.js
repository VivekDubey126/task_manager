const { createBlog, fetchAllBlogs, updateBlogById, deleteBlogById } = require('../Controllers/TaskController');

const router = require('express').Router();

// To get all the blogs
router.get('/', fetchAllBlogs);

// To create a blog post
router.post('/', createBlog);

// To update a blog post
router.put('/:id', updateBlogById);

// To delete a blog post
router.delete('/:id', deleteBlogById);

module.exports = router;