import { API_BASE, getAuthHeaders } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) {
        alert('Post not found');
        window.location.href = '/html/feed.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/social/posts/${postId}?_author=true`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch post.');

        const postData = await response.json();
        renderPost(postData.data);
    } catch (error) {
        console.error(error);
        document.getElementById('postContainer').innerHTML = '<p>Post not found.</p>';
    }
});

function renderPost(post) {
    const authorName = post.author?.name ? post.author.name : "Unknown User";

    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = `
        <div class="post-card">
            <h2>${post.title}</h2>
            <div class="post-image-wrapper">
                <img src="${post.media?.url || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}" 
                     alt="${post.media?.alt || 'Post Image'}" class="post-image">
            </div>
            <p>${post.body}</p>
            <small>Posted by <strong>${authorName}</strong> on ${new Date(post.created).toLocaleDateString()}</small>
            ${post.author?.name === localStorage.getItem('userName') 
                ? `<a href="/html/editPost.html?id=${post.id}"><button class="edit-btn">Edit</button></a>` 
                : ''}
        </div>
    `;
}
