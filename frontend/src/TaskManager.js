import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { CreateBlog, DeleteBlogById, GetAllBlogs, UpdateBlogById } from './api';
import { notify } from './utils';

function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [copyBlogs, setCopyBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({ title: '', description: '', image: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchBlogs = async () => {
        try {
            const { data } = await GetAllBlogs();
            setBlogs(data || []);
            setCopyBlogs(data || []);
        } catch (err) {
            notify('Failed to fetch blogs', 'error');
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentBlog.title || !currentBlog.description) {
            notify('Title and Description are required', 'error');
            return;
        }

        try {
            if (editingId) {
                const { success, message } = await UpdateBlogById(editingId, currentBlog);
                if (success) notify(message, 'success');
            } else {
                const { success, message } = await CreateBlog(currentBlog);
                if (success) notify(message, 'success');
            }
            setIsModalOpen(false);
            setCurrentBlog({ title: '', description: '', image: '' });
            setEditingId(null);
            fetchBlogs();
        } catch (err) {
            notify('Something went wrong', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this post?')) {
            try {
                const { success, message } = await DeleteBlogById(id);
                if (success) {
                    notify(message, 'success');
                    fetchBlogs();
                }
            } catch (err) {
                notify('Delete failed', 'error');
            }
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const results = copyBlogs.filter(b => 
            b.title.toLowerCase().includes(term) || 
            b.description.toLowerCase().includes(term)
        );
        setBlogs(results);
    };

    const openEdit = (blog) => {
        setCurrentBlog({ title: blog.title, description: blog.description, image: blog.image });
        setEditingId(blog._id);
        setIsModalOpen(true);
    };

    return (
        <div className="container py-5">
            <header className="text-center mb-5">
                <h1 className="display-3 fw-bold mb-3" style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Elite Insights
                </h1>
                <p className="text-muted fs-5">Luxury content for the modern era.</p>
                
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <div className="input-group glass w-50">
                        <span className="input-group-text bg-transparent border-0 text-muted"><FaSearch /></span>
                        <input onChange={handleSearch} type="text" className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Search articles..." />
                    </div>
                    <button onClick={() => { setEditingId(null); setCurrentBlog({ title: '', description: '', image: '' }); setIsModalOpen(true); }} className="btn btn-primary rounded-pill d-flex align-items-center gap-2">
                        <FaPlus /> New Post
                    </button>
                </div>
            </header>

            <div className="row g-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 glass text-white overflow-hidden transition-all hover-up">
                            {blog.image ? (
                                <img src={blog.image} className="card-img-top" alt={blog.title} style={{ height: '200px', objectFit: 'cover' }} />
                            ) : (
                                <div className="bg-dark d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                    <span className="text-muted">No Preview</span>
                                </div>
                            )}
                            <div className="card-body p-4">
                                <h3 className="card-title fw-bold h5 mb-3">{blog.title}</h3>
                                <p className="card-text text-muted mb-4 line-clamp-3">{blog.description}</p>
                                <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary">
                                    <small className="text-muted">{new Date(blog.createdAt).toLocaleDateString()}</small>
                                    <div className="d-flex gap-2">
                                        <button onClick={() => openEdit(blog)} className="btn btn-sm btn-outline-info border-0"><FaEdit /></button>
                                        <button onClick={() => handleDelete(blog._id)} className="btn btn-sm btn-outline-danger border-0"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Modal */}
            {isModalOpen && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content glass text-white p-4">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">{editingId ? 'Edit Post' : 'Create New Post'}</h5>
                                <button onClick={() => setIsModalOpen(false)} className="btn-close btn-close-white"></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <input value={currentBlog.title} onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value })} type="text" className="form-control glass mb-3 text-white" placeholder="Article Title" />
                                    <textarea value={currentBlog.description} onChange={e => setCurrentBlog({ ...currentBlog, description: e.target.value })} className="form-control glass mb-3 text-white" rows="5" placeholder="Tell your story..."></textarea>
                                    <input value={currentBlog.image} onChange={e => setCurrentBlog({ ...currentBlog, image: e.target.value })} type="text" className="form-control glass mb-3 text-white" placeholder="Image URL (Unsplash link recommended)" />
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline-secondary rounded-pill px-4">Cancel</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4">{editingId ? 'Update' : 'Publish'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer theme="dark" position="bottom-right" />

            <style>{`
                .hover-up:hover { transform: translateY(-10px); transition: 0.3s; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                .glass:focus { background: rgba(30, 41, 59, 0.9); border-color: #6366f1; color: white; box-shadow: none; }
                .modal-content.glass { border: 1px solid rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}

export default BlogManager;