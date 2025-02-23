import { API_BASE, getAuthHeaders } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) {
        alert('Post not found');
        window.location.href = '/html/feed.html';  
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/social/posts/${postId}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch post.');
        const postData = await response.json();

        populateEditForm(postData.data);
    } catch (error) {
        console.error(error);
        alert('Failed to load post for editing');
    }
});

function populateEditForm(post) {
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-body').value = post.body;
    document.getElementById('post-image').value = post.media?.url || '';
    document.getElementById('post-id').value = post.id;
}

document.getElementById('editPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const postId = document.getElementById('post-id').value;
    const updatedPost = {
        title: document.getElementById('post-title').value,
        body: document.getElementById('post-body').value,
        media: {
            url: document.getElementById('post-image').value,
            alt: "Post Image"
        }
    };

    try {
        const response = await fetch(`${API_BASE}/social/posts/${postId}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPost)
        });

        if (!response.ok) throw new Error('Failed to update post');
        const data = await response.json();

        alert('Post updated successfully');
        window.location.href = `/html/viewPost.html?id=${data.data.id}`;
    } catch (error) {
        console.error('Error updating post:', error);
        alert('Error updating post');
    }
});
