import { API_BASE, getAuthHeaders } from './config.js';

// Default placeholder image for posts
const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

document.addEventListener('DOMContentLoaded', async () => {
    const feedContainer = document.getElementById('postsContainer');
    const username = localStorage.getItem('userName');

    if (!feedContainer) {
        console.error("Feed container not found.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/social/posts?_author=true`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error("Unauthorized: Redirecting to login.");
                localStorage.removeItem("accessToken");
                window.location.href = "/html/login.html";
                return;
            }
            throw new Error('Failed to fetch posts.');
        }

        const posts = await response.json();
        renderFeedPosts(feedContainer, posts, username);
    } catch (error) {
        console.error('Error fetching posts:', error);
        feedContainer.innerHTML = '<p>Error loading the feed. Please try again later.</p>';
    }
});

function renderFeedPosts(container, posts, loggedInUser) {
    container.innerHTML = '';

    if (!posts.data || posts.data.length === 0) {
        container.innerHTML = '<p>No posts available yet.</p>';
        return;
    }

    posts.data.forEach(post => {
        const imageUrl = post.media?.url && post.media.url.startsWith("http") 
            ? post.media.url 
            : DEFAULT_IMAGE;

        const postElement = document.createElement('div');
        postElement.classList.add('post-card');
        postElement.innerHTML = `
            <div class="post-media">
                <img src="${imageUrl}" alt="${post.media?.alt || 'User Post'}">
            </div>
            <p class="post-caption">${post.body || 'No caption provided'}</p>
            <small>Posted by ${post.author?.name || 'Unknown'} on ${new Date(post.created).toLocaleDateString()}</small>
            <div class="post-actions">
                <a href="/html/viewPost.html?id=${post.id}"><button class="view-btn">View</button></a>
                ${post.author?.name === loggedInUser 
                    ? `<a href="/html/editPost.html?id=${post.id}"><button class="edit-btn">Edit</button></a>` 
                    : ''}
                ${post.author?.name === loggedInUser 
                    ? `<button class="delete-btn" onclick="deletePost('${post.id}')">Delete</button>` 
                    : ''}
            </div>
        `;
        container.appendChild(postElement);
    });
}

//  Ensure deletePost is globally accessible
async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        const response = await fetch(`${API_BASE}/social/posts/${postId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        alert('Post deleted successfully');
        window.location.reload();
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
    }
}

// Make deletePost function globally accessible
window.deletePost = deletePost;
