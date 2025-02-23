import { API_BASE, getAuthHeaders } from "./config.js";

// Default images
const DEFAULT_AVATAR = "https://eu-images.contentstack.com/v3/assets/blt69509c9116440be8/bltdab34f69f74c72fe/65380fc40ef0e002921fc072/AI-thinking-Kittipong_Jirasukhanont-alamy.jpg?width=1280&auto=webp&quality=95&format=jpg&disable=upscale";
const DEFAULT_BANNER = "https://eu-images.contentstack.com/v3/assets/blt69509c9116440be8/bltdab34f69f74c72fe/65380fc40ef0e002921fc072/AI-thinking-Kittipong_Jirasukhanont-alamy.jpg?width=1280&auto=webp&quality=95&format=jpg&disable=upscale";

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUser = localStorage.getItem("userName");
  const profileUsername = new URLSearchParams(window.location.search).get("user") || loggedInUser;

  if (!profileUsername) {
    console.error("No username found. Redirecting to login.");
    window.location.href = "/html/login.html";
    return;
  }

  await fetchProfileData(profileUsername);
  await fetchUserPosts(profileUsername);

  const followButton = document.getElementById("follow-btn");
  if (profileUsername !== loggedInUser) {
    followButton.style.display = "block";
    await setupFollowButton(profileUsername);
  } else {
    followButton.style.display = "none";
  }
});

async function fetchProfileData(username) {
  try {
    const response = await fetch(`${API_BASE}/social/profiles/${username}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const { data: profile } = await response.json();

    document.getElementById("username").textContent = profile.name;
    document.getElementById("post-count").textContent = profile._count.posts || 0;
    document.getElementById("followers-count").textContent = profile._count.followers || 0;
    document.getElementById("following-count").textContent = profile._count.following || 0;

    // Set avatar and banner images
    document.getElementById("avatar").src = profile.avatar?.url?.startsWith("http") 
      ? profile.avatar.url 
      : DEFAULT_AVATAR;

    document.getElementById("banner").src = profile.banner?.url?.startsWith("http") 
      ? profile.banner.url 
      : DEFAULT_BANNER;

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}

async function fetchUserPosts(username) {
  try {
    // ✅ Ensure author details are included
    const response = await fetch(`${API_BASE}/social/profiles/${username}/posts?_author=true`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Error fetching posts (Status: ${response.status})`);

    const posts = await response.json();
    renderPosts(posts.data, username);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function renderPosts(posts, loggedInUser) {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts available.</p>";
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post-card");

    const imageUrl = post.media?.url?.startsWith("http") ? post.media.url : DEFAULT_AVATAR;
    
    postElement.innerHTML = `
      <div class="post-media">
        <img src="${imageUrl}" alt="${post.media?.alt || "User Post"}">
      </div>
      <p class="post-caption">${post.body || "No caption provided"}</p>
      <small>Posted by ${post.author?.name || 'Unknown'} on ${new Date(post.created).toLocaleDateString()}</small>
      <div class="post-actions">
        <a href="/html/viewPost.html?id=${post.id}"><button class="view-btn">View</button></a>
        ${post.author?.name === loggedInUser 
          ? `<a href="/html/editPost.html?id=${post.id}"><button class="edit-btn">Edit</button></a>
             <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>` 
          : ''
        }
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}

// ✅ Ensure deletePost is globally accessible by attaching it to window
window.deletePost = async function deletePost(postId) {
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
};

/*************  ✨ Follow/Unfollow Feature ⭐ *************/
async function setupFollowButton(profileUsername) {
  try {
    const loggedInUser = localStorage.getItem("userName");
    const response = await fetch(`${API_BASE}/social/profiles/${loggedInUser}?_following=true`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch user following list.");
    const data = await response.json();

    const followingList = data.data.following.map(user => user.name);
    const followButton = document.querySelector("#follow-btn");

    if (followingList.includes(profileUsername)) {
      followButton.textContent = "Unfollow";
      followButton.classList.add("active");
    } else {
      followButton.textContent = "Follow";
      followButton.classList.remove("active");
    }

    followButton.onclick = () => toggleFollow(profileUsername, followButton, followingList.includes(profileUsername));

  } catch (error) {
    console.error("Error setting up follow button:", error);
  }
}

async function toggleFollow(profileUsername, followButton, isFollowing) {
  try {
    const action = isFollowing ? "unfollow" : "follow";
    const response = await fetch(`${API_BASE}/social/profiles/${profileUsername}/${action}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to ${action} user.`);

    followButton.textContent = isFollowing ? "Follow" : "Unfollow";
    followButton.classList.toggle("active");

  } catch (error) {
    console.error(`Error while trying to ${isFollowing ? "unfollow" : "follow"}:`, error);
  }
}
