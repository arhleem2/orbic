/**
 * OrbitDB - Mock Backend Service
 * Handles data persistence using localStorage to simulate a database.
 */

class OrbitDB {
    constructor() {
        this.STORAGE_KEYS = {
            USERS: 'orbit_users',
            POSTS: 'orbit_posts',
            NOTIFICATIONS: 'orbit_notifications',
            CURRENT_USER: 'orbit_current_user'
        };

        this.init();
    }

    init() {
        // Seed data if empty
        if (!localStorage.getItem(this.STORAGE_KEYS.POSTS)) {
            this.seed();
        }
    }

    seed() {
        console.log('OrbitDB: Initialized with empty state.');
        localStorage.setItem(this.STORAGE_KEYS.POSTS, JSON.stringify([]));
        localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }

    // --- USERS ---
    getUser() {
        // Default to a generic user until we have a real auth/profile setup flow
        return {
            name: localStorage.getItem('orbit_profile_name') || 'New User',
            handle: '@new_user',
            bio: localStorage.getItem('orbit_profile_bio') || 'Ready to explore.',
            avatar: localStorage.getItem('orbit_avatar') || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
            banner: localStorage.getItem('orbit_banner') || ''
        };
    }

    updateUser(data) {
        if (data.name) localStorage.setItem('orbit_profile_name', data.name);
        if (data.bio) localStorage.setItem('orbit_profile_bio', data.bio);
        if (data.website) localStorage.setItem('orbit_profile_website', data.website);
        if (data.banner) localStorage.setItem('orbit_banner', data.banner);
        // In a real app, we would update the 'users' collection here
    }

    // --- POSTS ---
    getPosts() {
        const posts = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.POSTS) || '[]');
        return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    createPost(content, image = null) {
        const posts = this.getPosts();
        const user = this.getUser();

        const newPost = {
            id: `post_${Date.now()}`,
            userId: 'current_user',
            user: {
                name: user.name,
                handle: user.handle,
                avatar: user.avatar
            },
            content: content,
            image: image,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0,
            likedBy: []
        };

        posts.unshift(newPost);
        this.savePosts(posts);
        return newPost;
    }

    toggleLike(postId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);

        if (post) {
            // Simplified toggle for current user mockup
            // In real app we check if current user ID is in likedBy
            post.likes += 1; // Just increment for fun/demo for now, or we can do strict toggle logic
            // Let's do strict toggle simulation
            const isLiked = post.likedBy.includes('current_user');
            if (isLiked) {
                post.likes = Math.max(0, post.likes - 1);
                post.likedBy = post.likedBy.filter(id => id !== 'current_user');
            } else {
                post.likes += 1;
                post.likedBy.push('current_user');
            }
            this.savePosts(posts);
            return post.likes;
        }
        return 0;
    }

    savePosts(posts) {
        localStorage.setItem(this.STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }

    // --- UTILS ---
    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    }
}

// Initialize Global DB Instance
const db = new OrbitDB();
console.log('OrbitDB: Service Started');
