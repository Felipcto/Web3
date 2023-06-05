import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogApp = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setBlogPosts(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMsg('Error retrieving posts.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchId === '') {
      setFilteredPosts(blogPosts);
    } else {
      const filtered = blogPosts.filter(post => post.id.toString() === searchId);
      setFilteredPosts(filtered);
    }
  }, [searchId, blogPosts]);

  const handleSearch = (e) => {
    setSearchId(e.target.value);
  };

  const addPost = async (title, body) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
        userId: 1,
      });
      const newPost = response.data;
      setBlogPosts([...blogPosts, newPost]);
    } catch (error) {
      setErrorMsg('Error creating post.');
    }
  };

  const updatePost = async (id, title, body) => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        id,
        title,
        body,
        userId: 1,
      });
      const updatedPost = response.data;
      const updatedBlogPosts = blogPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      );
      setBlogPosts(updatedBlogPosts);
    } catch (error) {
      setErrorMsg('Error updating post.');
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const updatedBlogPosts = blogPosts.filter(post => post.id !== id);
      setBlogPosts(updatedBlogPosts);
    } catch (error) {
      setErrorMsg('Error deleting post.');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (errorMsg) {
    return <div>{errorMsg}</div>;
  }

  return (
    <div>
      <h1>Criar Post do Blog</h1>
      <PostForm onSubmit={addPost} />
      <h1>Post do blog</h1>
      <input type="text" placeholder="Enter post ID" value={searchId} onChange={handleSearch} />
      <PostsList posts={filteredPosts} deletePost={deletePost} updatePost={updatePost} />
    </div>
  );
};

const PostsList = ({ posts, deletePost, updatePost }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditedTitle(post.title);
    setEditedBody(post.body);
  };

  const handleSave = () => {
    if (editingId) {
      updatePost(editingId, editedTitle, editedBody);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
      {posts.map(post => (
        <div key={post.id}>
          {editingId === post.id ? (
            <div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
              ></textarea>
              <button onClick={handleSave}>Salvar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          ) : (
            <div>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
              <button onClick={() => handleEdit(post)}>Editar</button>
              <button onClick={() => deletePost(post.id)}>Deletar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PostForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title, body);
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      ></textarea>
      <button type="submit">Criar novo post</button>
    </form>
  );
};

export default BlogApp;
