import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Blog = () => {
    const [blogName, setBlogName] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [blog, setBlog] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const { user } = useSelector((state) => state.profile);

    useEffect(() => {
        console.log("User state:", user); 
    }, [user]);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width / img.height > 16 / 9) {
                    alert('Thumbnail must have a 16:9 aspect ratio!');
                    setThumbnail(null);
                } else {
                    setThumbnail(file);
                }
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please login to create a blog post');
            return;
        }

        if (!blogName || !blogDescription || !thumbnail) {
            alert('All fields are required!');
            return;
        }

        const formData = new FormData();
        formData.append('blogName', blogName);
        formData.append('blogDescription', blogDescription);
        formData.append('thumbnail', thumbnail);
        formData.append('creator', user._id);

        try {
            const response = await axios.post('http://localhost:4000/api/v1/payment/createBlog', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            getBlogs();
            console.log(response.data);
            // Reset form
            setBlogName('');
            setBlogDescription('');
            setThumbnail(null);
            setIsModalOpen(false);
            setSelectedBlog(null);
        } catch (error) {
            console.error('Error uploading blog:', error);
            alert('Error creating blog post. Please try again.');
        }
    };

    const getBlogs = async () => {
        try {
            let response = await axios.get("http://localhost:4000/api/v1/payment/getBlogs");
            setBlog(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching blogs:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getBlogs();
    }, []);

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        if (!user) {
            alert('Please login to create a blog post');
            return;
        }
        setIsModalOpen(true);
        setSelectedBlog(null);
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-[#000000] min-h-screen text-white relative overflow-x-hidden"
        >
            {/* Main Container */}
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full rounded-2xl overflow-hidden group cursor-pointer my-8 hover:shadow-2xl hover:shadow-purple-900/30 transition-all duration-500"
                >
                    {blog[0] && (
                        <div className="relative aspect-[16/6] w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-75"></div>
                            <motion.img 
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.2 }}
                                src={blog[0].thumbnail} 
                                alt="Featured Blog" 
                                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                            />
                            <motion.div 
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="absolute inset-0 z-20 flex flex-col justify-center p-12"
                            >
                                <div className="max-w-2xl transform transition-all duration-300 group-hover:translate-x-3">
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }}
                                        className="inline-block bg-blue-600/90 text-xs px-3 py-1 rounded-full mb-4 backdrop-blur-sm"
                                    >
                                        Breaking news
                                    </motion.div>
                                    <h1 className="text-4xl font-bold mb-4 text-white transform transition-all duration-300 group-hover:text-blue-400">
                                        {blog[0].blogName}
                                    </h1>
                                    <div className="flex items-center gap-3 text-sm text-gray-200">
                                        <span>Dec 24, 2022</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
                                        >
                                            5 mins read
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Latest Posts Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="py-16 overflow-hidden"
                >
                    <motion.h2 
                        whileHover={{ scale: 1.02, x: 10 }}
                        className="text-4xl font-bold mb-12 hover:text-blue-400 transition-colors inline-block cursor-pointer"
                    >
                        Latest posts
                    </motion.h2>
                    
                    <div className="flex justify-between items-center mb-8">
                        <motion.button
                            onClick={handleCreateClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Blog
                        </motion.button>
                    </div>
                    
                    <div className="flex flex-col gap-8">
                        {/* First Latest Post */}
                        {blog[1] && (
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="group flex flex-col md:flex-row rounded-2xl overflow-hidden cursor-pointer bg-[#0A0A0A] hover:bg-[#111111] transition-all duration-500 border border-gray-800/30 hover:border-gray-700/50 shadow-xl hover:shadow-purple-900/20 transform hover:-translate-y-1"
                            >
                                <div className="w-full md:w-1/2 h-[300px] md:h-[400px] overflow-hidden">
                                    <img 
                                        src={blog[1].thumbnail} 
                                        alt={blog[1].blogName} 
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center transform transition-transform duration-300 group-hover:translate-x-2">
                                    <div className="text-indigo-400 text-sm mb-3 hover:text-indigo-300">Do consectetur</div>
                                    <h3 className="text-2xl md:text-3xl font-semibold mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">{blog[1].blogName}</h3>
                                    <p className="text-gray-400 text-base mb-6 line-clamp-3 group-hover:text-gray-300">
                                        {blog[1].blogDescription}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="group-hover:text-gray-300 transition-colors">{new Date(blog[1].createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <button className="bg-indigo-600/80 text-white px-4 py-1.5 rounded-full text-sm transform transition-all hover:bg-indigo-500 hover:scale-105">
                                            5 mins read
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Second Latest Post */}
                        {blog[2] && (
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="group flex flex-col md:flex-row-reverse rounded-2xl overflow-hidden cursor-pointer bg-[#0A0A0A] hover:bg-[#111111] transition-all duration-500 border border-gray-800/30 hover:border-gray-700/50 shadow-xl hover:shadow-cyan-900/20 transform hover:-translate-y-1"
                            >
                                <div className="w-full md:w-1/2 h-[300px] md:h-[400px] overflow-hidden">
                                    <img 
                                        src={blog[2].thumbnail} 
                                        alt={blog[2].blogName} 
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center transform transition-transform duration-300 group-hover:translate-x-2">
                                    <div className="text-cyan-400 text-sm mb-3 hover:text-cyan-300">Do consectetur</div>
                                    <h3 className="text-2xl md:text-3xl font-semibold mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">{blog[2].blogName}</h3>
                                    <p className="text-gray-400 text-base mb-6 line-clamp-3 group-hover:text-gray-300">
                                        {blog[2].blogDescription}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="group-hover:text-gray-300 transition-colors">{new Date(blog[2].createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <button className="bg-cyan-600/80 text-white px-4 py-1.5 rounded-full text-sm transform transition-all hover:bg-cyan-500 hover:scale-105">
                                            5 mins read
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* All Posts Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-20"
                >
                    <motion.h2 
                        whileHover={{ scale: 1.02, x: 10 }}
                        className="text-3xl font-bold mb-12 hover:text-blue-400 transition-colors inline-block cursor-pointer"
                    >
                        All posts
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blog.slice(3).map((item, index) => (
                            <motion.div 
                                key={item._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 * index }}
                                whileHover={{ y: -8 }}
                                className="group bg-[#0A0A0A] hover:bg-[#111111] rounded-xl overflow-hidden cursor-pointer border border-gray-800/30 hover:border-gray-700/50 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-900/20"
                            onClick={() => handleBlogClick(item)}
                        >
                                <div className="aspect-video overflow-hidden">
                                    <img 
                                        src={item.thumbnail} 
                                        alt={item.blogName} 
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 md:p-8">
                                    <div className="text-blue-400 text-sm mb-3 group-hover:text-blue-300 transition-colors">Do consectetur</div>
                                    <h3 className="text-xl font-semibold mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors">{item.blogName}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="group-hover:text-gray-300 transition-colors">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <span className="text-blue-400 group-hover:text-blue-300 transition-colors cursor-pointer">Read more</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Create Blog Button with enhanced animation */}
            <motion.button 
                onClick={handleCreateClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300 flex items-center justify-center text-2xl z-50 cursor-pointer hover:shadow-xl hover:shadow-blue-600/50"
                title={user ? "Create New Blog" : "Login to Create Blog"}
            >
                +
            </motion.button>

            {/* Modal with enhanced animations */}
            {isModalOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 backdrop-blur-sm"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="flex w-[500px] flex-col items-center p-6 text-white bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gray-800/50 shadow-2xl"
                    >
                        {selectedBlog ? (
                            <>
                                <div className='flex items-center justify-between w-full'>
                                    <h1 className="text-2xl font-bold hover:text-blue-400 transition-colors">{selectedBlog.blogName}</h1>
                                    <button 
                                        onClick={() => { setIsModalOpen(false); setSelectedBlog(null); }}
                                        className="text-gray-400 hover:text-white transition-colors text-xl"
                                    >
                                        ✖
                                    </button>
                                </div>
                                <img 
                                    src={selectedBlog.thumbnail} 
                                    alt="Blog Thumbnail" 
                                    className="w-full h-64 rounded-lg mt-4 object-cover hover:shadow-xl transition-shadow"
                                />
                                <p className="text-gray-300 mt-6 hover:text-gray-100 transition-colors">{selectedBlog.blogDescription}</p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <h1 className="text-2xl font-bold hover:text-blue-400 transition-colors">Create a Blog</h1>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-400 hover:text-white transition-colors text-xl"
                                    >
                                        ✖
                                    </button>
                                </div>
                                <form className="flex flex-col gap-4 w-full mt-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 hover:text-blue-400 transition-colors">Blog Title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter blog title"
                                            value={blogName}
                                            onChange={(e) => setBlogName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-700 focus:border-blue-500 focus:outline-none hover:border-gray-600 transition-colors text-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 hover:text-blue-400 transition-colors">Blog Description</label>
                                        <textarea
                                            placeholder="Enter blog description"
                                            value={blogDescription}
                                            onChange={(e) => setBlogDescription(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-700 focus:border-blue-500 focus:outline-none hover:border-gray-600 transition-colors h-32 text-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 hover:text-blue-400 transition-colors">Blog Thumbnail</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-700 focus:border-blue-500 focus:outline-none hover:border-gray-600 transition-colors text-black"
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="w-full bg-blue-600 text-white font-medium px-6 py-3 rounded-lg mt-4 hover:bg-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-600/50"
                                    >
                                        Create Blog Post
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Blog;
