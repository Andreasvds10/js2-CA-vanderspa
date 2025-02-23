import { API_BASE, getAuthHeaders } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById("createPostForm");

    if (createPostForm) {
        createPostForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const title = document.getElementById('postTitle').value.trim();
            const body = document.getElementById('postContent').value.trim();
            const tags = document.getElementById('tags').value.trim().split(',').map(tag => tag.trim()).filter(tag => tag !== "");
            const imageUrl = document.getElementById('imageURL').value.trim();

            if (!title || !imageUrl) {
                alert('Title and Image URL are required.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/social/posts`, {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        title: title,
                        body: body || "",
                        tags: tags.length > 0 ? tags : undefined, // Only include tags if present
                        media: {
                            url: imageUrl,
                            alt: title,
                        },
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error(errorData.errors?.[0]?.message || 'Failed to create post.');
                }

                alert("Post created successfully!");
                window.location.href = "/html/profile.html";
            } catch (error) {
                console.error("Error creating post:", error);
                alert(`Failed to create post: ${error.message}`);
            }
        });
    }
});
