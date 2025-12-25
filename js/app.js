// App.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Authentication System ---
    const isLoggedIn = localStorage.getItem('orbit_auth');
    const currentPage = window.location.pathname.split('/').pop();

    // 1. Protect Routes: If not logged in and NOT on login page, redirect
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return; // Stop execution
    }

    // 2. Handle Login Page Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // If already logged in, go to home
        if (isLoggedIn) {
            window.location.href = 'index.html';
            return;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate API Call
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Authenticating...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                localStorage.setItem('orbit_auth', 'true');
                window.location.href = 'index.html';
            }, 800);
        });
        return; // Don't run other app logic on login page
    }

    // 3. Handle Logout Trigger (Simulated via global listen or specific btn)
    // Looking for a logout button if it exists
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.logout-btn')) { // Class we will add to settings
            localStorage.removeItem('orbit_auth');
            window.location.href = 'login.html';
        }
    });

    console.log('Orbit Social Loaded');
    // --- End Auth System ---

    // Like Button Interaction
    const likeBtns = document.querySelectorAll('.action-btn.like');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            const icon = this.querySelector('svg');
            if (this.classList.contains('active')) {
                icon.style.fill = '#f43f5e';
                icon.style.stroke = '#f43f5e';
                let count = parseInt(this.textContent.trim());
                this.innerHTML = `${icon.outerHTML} ${count + 1}`;
                this.querySelector('svg').style.fill = '#f43f5e'; // Ensure fill persists
            } else {
                icon.style.fill = 'none';
                icon.style.stroke = 'currentColor';
                let count = parseInt(this.textContent.trim());
                this.innerHTML = `${icon.outerHTML} ${count - 1}`;
            }
        });
    });

    // Simple "Create Post" focus effect & Logic
    const createInput = document.querySelector('.create-input');
    const createPostContainer = document.querySelector('.create-post');
    const postBtn = document.getElementById('btnPost'); // We added this in HTML

    if (createInput && createPostContainer) {

        // Show button on focus
        createInput.addEventListener('focus', () => {
            createPostContainer.style.borderColor = 'var(--primary)';
            createPostContainer.style.boxShadow = '0 0 0 1px var(--primary)';
            if (postBtn) postBtn.style.display = 'block';
        });

        // Hide button on blur if empty (optional, keeping it simple for now)
        createInput.addEventListener('blur', () => {
            createPostContainer.style.borderColor = 'var(--border-subtle)';
            createPostContainer.style.boxShadow = 'none';
            // setTimeout(() => { if(createInput.value === '') postBtn.style.display = 'none'; }, 200); 
        });

        // --- RENDER POSTS FROM DB ---
        const renderPosts = () => {
            const feed = document.getElementById('feed-stream');
            if (!feed) return;

            feed.innerHTML = ''; // Clear existing
            const posts = db.getPosts();

            posts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'post-card';
                article.dataset.id = post.id;

                // Check if liked by current user
                const isLiked = post.likedBy.includes('current_user') ? 'active' : '';
                const likeFill = isLiked ? '#f43f5e' : 'none';
                const likeStroke = isLiked ? '#f43f5e' : 'currentColor';

                // Image HTML
                let imageHTML = '';
                if (post.image) {
                    imageHTML = `<img src="${post.image}" class="post-image" loading="lazy">`;
                }

                article.innerHTML = `
                <div class="post-header">
                    <div class="user-info">
                        <div class="avatar" style="background-image: url('${post.user.avatar}');"></div>
                        <div class="user-meta">
                            <span class="name">${post.user.name}</span>
                            <span class="username">${post.user.handle}</span>
                        </div>
                    </div>
                    <div class="more-options"><small>${db.formatDate(post.timestamp)}</small> ...</div>
                </div>
                <div class="post-content">
                    ${post.content}
                    ${imageHTML}
                </div>
                <div class="post-actions">
                    <button class="action-btn comment">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        ${post.comments}
                    </button>
                    <button class="action-btn retweet">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                        0
                    </button>
                    <button class="action-btn like ${isLiked}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${likeFill}" stroke="${likeStroke}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        ${post.likes}
                    </button>
                    <button class="action-btn share">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                </div>
            `;
                feed.appendChild(article);

                // Initialize features for this post
                if (typeof setupCommentSystem === 'function') setupCommentSystem(article);
            });

            // Attach Like Listeners
            // Attach Like Listeners with Reaction & Confetti
            const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
            const fireConfetti = (x, y) => {
                for (let i = 0; i < 30; i++) {
                    const el = document.createElement('div');
                    el.style.position = 'fixed';
                    el.style.left = x + 'px';
                    el.style.top = y + 'px';
                    el.style.width = '8px';
                    el.style.height = '8px';
                    el.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                    el.style.zIndex = '9999';
                    el.style.pointerEvents = 'none';
                    document.body.appendChild(el);

                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 5 + Math.random() * 5;
                    const dx = Math.cos(angle) * velocity;
                    const dy = Math.sin(angle) * velocity;

                    let posX = x, posY = y;
                    let life = 100;

                    const anim = setInterval(() => {
                        posX += dx;
                        posY += dy + (100 - life) * 0.1; // Gravity
                        el.style.left = posX + 'px';
                        el.style.top = posY + 'px';
                        el.style.opacity = life / 100;
                        life--;
                        if (life <= 0) {
                            clearInterval(anim);
                            el.remove();
                        }
                    }, 20);
                }
            };

            document.querySelectorAll('.action-btn.like').forEach(btn => {
                // Remove old listeners specifically for reactions if replacing
                // For simplicity in this flow, we assume we are enhancing the current button

                let pressTimer;

                // Long Press for Reactions
                btn.addEventListener('mousedown', (e) => {
                    pressTimer = setTimeout(() => {
                        showReactions(btn, e.clientX, e.clientY);
                    }, 600);
                });

                btn.addEventListener('mouseup', () => clearTimeout(pressTimer));
                btn.addEventListener('mouseleave', () => clearTimeout(pressTimer));

                // Click (Normal Like)
                btn.addEventListener('click', function (e) {
                    // If reaction menu is open, don't toggle like immediately
                    if (document.querySelector('.reaction-menu')) return;

                    const card = this.closest('.post-card');
                    if (card) {
                        const newCount = db.toggleLike(card.dataset.id);
                        this.classList.toggle('active');

                        const icon = this.querySelector('svg');
                        if (this.classList.contains('active')) {
                            icon.style.fill = '#f43f5e';
                            icon.style.stroke = '#f43f5e';

                            // Trigger Confetti if milestone (mock logic: every like triggers for demo)
                            fireConfetti(e.clientX, e.clientY);
                        } else {
                            icon.style.fill = 'none';
                            icon.style.stroke = 'currentColor';
                            // Reset to default heart if unlike
                            this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> ${newCount}`;
                            return;
                        }
                        this.innerHTML = `${icon.outerHTML} ${newCount}`;
                    }
                });
            });

            // Reaction Menu Logic
            const showReactions = (targetBtn, x, y) => {
                // Remove existing
                const existing = document.querySelector('.reaction-menu');
                if (existing) existing.remove();

                const menu = document.createElement('div');
                menu.className = 'reaction-menu';
                menu.style.position = 'fixed';
                menu.style.left = (x - 60) + 'px';
                menu.style.top = (y - 50) + 'px';
                menu.style.background = 'var(--bg-card)';
                menu.style.border = '1px solid var(--border-subtle)';
                menu.style.borderRadius = '20px';
                menu.style.padding = '8px';
                menu.style.display = 'flex';
                menu.style.gap = '8px';
                menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                menu.style.zIndex = '9999';
                menu.style.animation = 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                const reactions = ['❤️', '😂', '😮', '😢', '🔥'];

                reactions.forEach(emoji => {
                    const span = document.createElement('span');
                    span.textContent = emoji;
                    span.style.fontSize = '24px';
                    span.style.cursor = 'pointer';
                    span.style.transition = 'transform 0.1s';
                    span.onmouseover = () => span.style.transform = 'scale(1.2)';
                    span.onmouseout = () => span.style.transform = 'scale(1)';

                    span.onclick = (e) => {
                        e.stopPropagation();
                        // Update Button
                        targetBtn.classList.add('active');
                        targetBtn.innerHTML = `<span style="font-size:18px;">${emoji}</span> ${parseInt(targetBtn.textContent.trim()) + 1}`;

                        // Fire confetti
                        fireConfetti(x, y);
                        menu.remove();
                    };
                    menu.appendChild(span);
                });

                document.body.appendChild(menu);

                // Close on click outside
                const closeHandler = (e) => {
                    if (!menu.contains(e.target)) {
                        menu.remove();
                        document.removeEventListener('click', closeHandler);
                    }
                };
                setTimeout(() => document.addEventListener('click', closeHandler), 10);
            };
        };

        // Render initially
        renderPosts();

        // Updated Create Post
        const createPost = () => {
            const text = createInput.value.trim();
            if (!text) return;

            // Use DB Service
            db.createPost(text);

            // Re-render
            renderPosts();
            createInput.value = '';
            showToast('Post published & saved!', 'success');
        };

        // Event Listeners for Posting
        if (postBtn) {
            postBtn.addEventListener('click', createPost);
        }

        createInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createPost();
            }
        });
    }

    // --- Account Privacy Settings Persistence ---
    const settingsMap = {
        'privateAccount': 'orbit_private_account',
        'activityStatus': 'orbit_activity_status',
        'allowTagging': 'orbit_allow_tagging'
    };

    Object.keys(settingsMap).forEach(elemId => {
        const toggle = document.getElementById(elemId);
        const storageKey = settingsMap[elemId];

        if (toggle) {
            // Load saved state (defaulting to current HTML state if null)
            const savedState = localStorage.getItem(storageKey);
            if (savedState !== null) {
                toggle.checked = (savedState === 'true');
            }

            // Save on change
            toggle.addEventListener('change', function () {
                localStorage.setItem(storageKey, this.checked);
            });
        }
    });



    // --- Image Lightbox Logic ---
    // Create Lightbox DOM if not exists
    if (!document.getElementById('lightboxModal')) {
        const modal = document.createElement('div');
        modal.id = 'lightboxModal';
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="lightboxImage">
        `;
        document.body.appendChild(modal);
    }

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    const exploreItems = document.querySelectorAll('.explore-item');

    // Open Lightbox
    exploreItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                lightboxModal.style.display = "flex";
                // Trigger reflow for transition
                void lightboxModal.offsetWidth;
                lightboxModal.classList.add('show');
                lightboxImg.src = img.src;
            }
        });
    });

    // Close Lightbox functions
    const closeLightbox = () => {
        lightboxModal.classList.remove('show');
        setTimeout(() => {
            lightboxModal.style.display = "none";
        }, 300); // Wait for transition
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }
    // --- Toast Notification System ---
    const showToast = (message, type = 'info') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container); // Append to body
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Define Icons
        let iconSvg = '';
        if (type === 'success') iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        else if (type === 'error') iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        else iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    // Integrate with Privacy Toggles (from previous persistence step)
    const privacyToggles = ['privateAccount', 'activityStatus', 'allowTagging'];
    privacyToggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // We'll attach a change listener for feedback
            el.addEventListener('change', () => {
                showToast('Privacy settings updated', 'success');
            });
        }
    });

    // Attach to Share Buttons (simulated)
    document.querySelectorAll('.action-btn.share').forEach(btn => {
        btn.addEventListener('click', () => {
            // Simulate copy link
            showToast('Link copied to clipboard', 'info');
        });
    });

    // Attach to 'Post' button (Global Listener approach)
    // Note: The original listener inside createPost logic is in a local scope. 
    // We can just add a global delegate or find the button globally if it exists.
    const postBtnGlobal = document.getElementById('btnPost');
    if (postBtnGlobal) {
        postBtnGlobal.addEventListener('click', () => {
            const input = document.querySelector('.create-input');
            if (input && input.value.trim() !== '') {
                // Wait a tiny bit for the post animation to start
                setTimeout(() => showToast('Post published successfully', 'success'), 200);
            }
        });
    }

    // --- Interactive Comment System ---
    const setupCommentSystem = (postElement) => {
        const commentBtn = postElement.querySelector('.action-btn.comment');
        if (!commentBtn) return;

        // Container setup
        // Check if comment section already exists (it shouldn't for new posts, but good for safety)
        let commentSection = postElement.querySelector('.post-comments');

        commentBtn.addEventListener('click', () => {
            // Lazy Load: Create the HTML only when clicked
            if (!commentSection) {
                commentSection = document.createElement('div');
                commentSection.className = 'post-comments';
                commentSection.innerHTML = `
                    <div class="comment-input-area">
                        <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');"></div>
                        <input type="text" class="comment-input" placeholder="Write a reply...">
                        <button class="btn-send-comment">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                    <div class="comment-list">
                        <!-- Comments will go here -->
                    </div>
                `;
                // Append to post
                postElement.appendChild(commentSection);

                // Attach Event Listeners for the new input
                const input = commentSection.querySelector('.comment-input');
                const sendBtn = commentSection.querySelector('.btn-send-comment');
                const list = commentSection.querySelector('.comment-list');

                const addComment = () => {
                    const text = input.value.trim();
                    if (!text) return;

                    // Add new comment
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    const safeContent = window.filterComment ? window.filterComment(input.value) : input.value;
                    newComment.innerHTML = `
                    <div class="avatar" style="width:24px; height:24px; background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');"></div>
                    <div class="comment-content">
                        <span class="comment-user">Felix Admin</span>
                        ${safeContent}
                    </div>
                `;
                    list.appendChild(newComment);
                    input.value = '';

                    // Update Count
                    let currentCount = parseInt(commentBtn.textContent.trim()) || 0;
                    const icon = commentBtn.querySelector('svg').outerHTML;
                    commentBtn.innerHTML = `${icon} ${currentCount + 1}`;
                };

                sendBtn.addEventListener('click', addComment);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') addComment();
                });
            }

            // Toggle Visibility
            commentSection.classList.toggle('show');
            if (commentSection.classList.contains('show')) {
                const input = commentSection.querySelector('.comment-input');
                if (input) setTimeout(() => input.focus(), 100);
            }
        });
    };

    // Apply to Initial Posts
    document.querySelectorAll('.post-card').forEach(post => {
        setupCommentSystem(post);
    });

    // Modified Create Post to include Comment System
    const postBtnObserver = document.getElementById('btnPost');
    if (postBtnObserver) {
        // We replace the old listener if we can, but since we can't easily remove anonymous listeners, 
        // we'll just rely on the fact that we are adding *additional* behavior or 
        // effectively, we can just attach the setupCommentSystem to the *newly created* node
        // inside the MutationObserver or just piggyback on the click.

        // Actually, the previous 'createPost' was internal. 
        // To properly hook this up without rewriting the whole function repeatedly:
        // We will Attach a MutationObserver to the feed to auto-setup new posts.
        // This is cleaner/more advanced.

        const feedObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('post-card')) {
                        setupCommentSystem(node);
                    }
                });
            });
        });

        const feedStream = document.getElementById('feed-stream');
        if (feedStream) {
            feedObserver.observe(feedStream, { childList: true });
        }
    }


    // --- Infinite Scroll & Skeleton Loading ---
    const feedStream = document.getElementById('feed-stream');
    let isLoading = false;

    const createSkeleton = () => {
        const skeleton = document.createElement('article');
        skeleton.className = 'post-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-header">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton-meta">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line short"></div>
                </div>
            </div>
            <div class="skeleton-content">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `;
        return skeleton;
    };

    const loadMorePosts = () => {
        if (isLoading) return;
        isLoading = true;

        // In a real app, we would fetch the next page from the DB.
        // For now, since we only have local storage, we just stop loading.
        // Or we could implement pagination if we had many posts.

        // Hide loader after a delay to simulate check
        setTimeout(() => {
            isLoading = false;
        }, 1000);
    };

    // Intersection Observer to trigger load
    if (feedStream) {
        const sentinel = document.createElement('div');
        sentinel.id = 'feed-sentinel';
        sentinel.style.height = '20px';
        feedStream.appendChild(sentinel);

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMorePosts();
            }
        }, { rootMargin: '200px' });

        observer.observe(sentinel);
    }

    // Call Hover cards initially
    if (typeof setupHoverCards === 'function') setupHoverCards();

    // --- Interactive Story Viewer ---
    const setupStoryViewer = () => {
        // 1. Create Viewer HTML if needed
        if (!document.getElementById('story-viewer')) {
            const viewerHTML = `
                <div id="story-viewer">
                    <div class="story-progress-container">
                        <div class="story-progress-bar" id="story-progress"></div>
                    </div>
                    <div class="story-header">
                        <div class="avatar" id="story-avatar" style="width:32px; height:32px; border:none;"></div>
                        <span style="color:white; font-weight:600;" id="story-username">User</span>
                        <span style="color:rgba(255,255,255,0.7); font-size:0.9em;">12h</span>
                    </div>
                    <div class="story-close">&times;</div>
                    <div class="story-content-wrapper">
                        <img id="story-image" class="story-image" src="" alt="Story">
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', viewerHTML);
        }

        const viewer = document.getElementById('story-viewer');
        const progressBar = document.getElementById('story-progress');
        const storyImg = document.getElementById('story-image');
        const storyAvatar = document.getElementById('story-avatar');
        const storyUsername = document.getElementById('story-username');
        const closeBtn = viewer.querySelector('.story-close');

        let progressInterval;
        let width = 0;

        const closeStory = () => {
            viewer.classList.remove('active');
            clearInterval(progressInterval);
            width = 0;
            progressBar.style.width = '0%';
        };

        const openStory = (avatarUrl, username) => {
            // Set Content (Simulated)
            // Default random image
            let contentUrl = `https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop`;

            // Custom images for demo users
            if (username.startsWith('jessica')) contentUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
            if (username.startsWith('david')) contentUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop';
            if (username.startsWith('mike')) contentUrl = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop';

            storyImg.src = contentUrl;
            storyAvatar.style.backgroundImage = `url('${avatarUrl}')`;
            storyUsername.textContent = username;

            viewer.classList.add('active');

            // Start Progress
            width = 0;
            clearInterval(progressInterval);
            progressBar.style.width = '0%';

            // 5 second duration
            const duration = 5000;
            const step = 50;
            const increment = (step / duration) * 100;

            progressInterval = setInterval(() => {
                if (width >= 100) {
                    closeStory();
                } else {
                    width += increment;
                    progressBar.style.width = width + '%';
                }
            }, step);
        };

        // Attach Listeners via Delegation (Better for dynamic content)
        const storiesContainer = document.querySelector('.stories-container');
        if (storiesContainer) {
            storiesContainer.addEventListener('click', (e) => {
                const storyItem = e.target.closest('.story-item');
                // Ignore if clicked on "Add Story" or not a story item
                if (!storyItem || storyItem.classList.contains('story-add')) return;

                const avatarDiv = storyItem.querySelector('.story-avatar');
                const userSpan = storyItem.querySelector('.story-user');

                if (avatarDiv && userSpan) {
                    // Extract URL safely
                    const style = window.getComputedStyle(avatarDiv);
                    let bgImage = style.backgroundImage;
                    // Remove url("...") wrapper
                    bgImage = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');

                    const username = userSpan.textContent.trim();
                    openStory(bgImage, username);
                }
            });
        }

        // Close Listeners
        closeBtn.addEventListener('click', closeStory);
        viewer.addEventListener('click', (e) => {
            if (e.target === viewer) closeStory();
        });
    };

    // Initialize

    // --- IMAGE UPLOAD LOGIC --- //
    const setupImageUpload = () => {
        const btnPhoto = document.getElementById('btn-photo');
        const fileInput = document.getElementById('file-upload');
        const previewContainer = document.getElementById('image-preview-container');
        const previewImage = document.getElementById('image-preview');
        const removeImageBtn = document.getElementById('remove-image');
        const createInput = document.querySelector('.create-input');

        if (btnPhoto && fileInput) {
            btnPhoto.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        previewImage.src = event.target.result;
                        previewContainer.style.display = 'block';
                        // Show post button if hidden
                        const btnPost = document.getElementById('btnPost');
                        if (btnPost) btnPost.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            removeImageBtn.addEventListener('click', () => {
                fileInput.value = '';
                previewImage.src = '';
                previewContainer.style.display = 'none';
                if (createInput.value.trim() === '') {
                    // document.getElementById('btnPost').style.display = 'none'; // Optional: hide if text empty too
                }
            });
        }
    };
    setupImageUpload();

    // Hook into existing Create Post logic:
    // We need to modify 'btnPost' listener. 
    // Since we didn't export the original listener, we might need to replace it or just attach a new one 
    // that overrides the previous behavior?
    // Actually, the previous logic is:
    /*
    btnPost.addEventListener('click', () => {
         const content = input.value;
         if (content.trim()) { ... }
    });
    */
    // We can't easily "hook" into that closure without rewriting it.
    // OPTION: We'll overwrite the 'click' listener by cloning and replacing the node to clear old listeners, then re-adding.
    // OR simpler: We'll modify the `addPost` function if we can access it.
    // But `addPost` logic was inline. 
    // Let's rewrite the Post Logic for the newly added Image support.

    // --- PHASE 1 FEATURES: POLLS, GIF, VOICE & POST LOGIC --- //
    const setupPostAddons = () => {
        const btnPoll = document.getElementById('btn-poll');
        const pollContainer = document.getElementById('poll-creator');
        const btnPost = document.getElementById('btnPost');

        // GIF & Voice Simulation
        document.getElementById('btn-gif')?.addEventListener('click', () => {
            const createInput = document.querySelector('.create-input');
            createInput.value += ' [GIF: Funny Cat] ';
            showToast('GIF attached!', 'success');
            btnPost.style.display = 'block';
        });

        document.getElementById('btn-voice')?.addEventListener('click', () => {
            const createInput = document.querySelector('.create-input');
            createInput.value += ' 🎤 Voice Note (0:15) ';
            showToast('Voice note recorded!', 'success');
            btnPost.style.display = 'block';
        });

        if (btnPoll) {
            btnPoll.addEventListener('click', () => {
                const isHidden = pollContainer.style.display === 'none';
                pollContainer.style.display = isHidden ? 'block' : 'none';
                if (isHidden) btnPost.style.display = 'block';
            });
        }
    };
    setupPostAddons();

    // REDEFINING POST LOGIC
    const inputElement = document.querySelector('.create-input');
    const existingBtnPost = document.getElementById('btnPost');
    const streamContainer = document.getElementById('feed-stream');

    if (existingBtnPost && inputElement && streamContainer) {
        // Clone to clear old listeners
        const newBtnPost = existingBtnPost.cloneNode(true);
        existingBtnPost.parentNode.replaceChild(newBtnPost, existingBtnPost);

        inputElement.addEventListener('input', function () {
            if (this.value.trim().length > 0) newBtnPost.style.display = 'block';
        });

        newBtnPost.addEventListener('click', () => {
            const content = inputElement.value;
            const fileInput = document.getElementById('file-upload');
            const hasImage = fileInput.files && fileInput.files.length > 0;
            const imageSrc = document.getElementById('image-preview').src;

            // Poll Data
            const pollContainer = document.getElementById('poll-creator');
            const hasPoll = pollContainer.style.display !== 'none';
            const opt1 = document.getElementById('poll-opt-1').value || 'Yes';
            const opt2 = document.getElementById('poll-opt-2').value || 'No';

            if (!content && !hasImage && !hasPoll) return;

            const article = document.createElement('article');
            article.className = 'post-card new-post';

            let attachmentHTML = '';
            if (hasImage) {
                attachmentHTML += `<img src="${imageSrc}" class="post-image">`;
            }
            if (hasPoll) {
                attachmentHTML += `
                    <div class="poll-widget" style="margin-top:12px; border:1px solid var(--border-subtle); border-radius:12px; padding:12px;">
                        <div class="poll-option" style="background:var(--bg-input); padding:8px; border-radius:8px; margin-bottom:8px; cursor:pointer;">${opt1} <span style="float:right">0%</span></div>
                        <div class="poll-option" style="background:var(--bg-input); padding:8px; border-radius:8px; cursor:pointer;">${opt2} <span style="float:right">0%</span></div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">0 votes · 1 day left</div>
                    </div>
                `;
            }

            // Check for simulated GIF/Voice tags
            let finalContent = content;
            if (content.includes('[GIF:')) {
                finalContent = content.replace(/\[GIF: (.*?)\]/g, '<div style="margin-top:8px; border-radius:12px; overflow:hidden;"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXcwODR4aHhqZGd6aHhqZGd6aHhqZGZ6aHhqZGd6aHhqZGd6aHhqZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CjmvTCZf2U3p09Cn0h/giphy.gif" style="width:100%;"></div>');
            }
            if (content.includes('🎤 Voice Note')) {
                finalContent = content.replace(/🎤 Voice Note \(.*?\)/g, `
                    <div style="margin-top:10px; background:var(--bg-input); padding:10px; border-radius:20px; display:flex; align-items:center; gap:10px;">
                        <button style="background:var(--primary); border:none; border-radius:50%; width:30px; height:30px; color:white;">▶</button>
                        <div style="height:4px; flex:1; background:var(--border); border-radius:2px;"></div>
                        <span style="font-size:12px;">0:15</span>
                    </div>
                 `);
            }

            article.innerHTML = `
                <div class="post-header">
                    <div class="user-info">
                        <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');"></div>
                        <div class="user-meta">
                            <span class="name">You</span>
                            <span class="username">@current_user</span>
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    ${finalContent}
                    ${attachmentHTML}
                </div>
                <div class="post-actions">
                     <button class="action-btn comment"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> 0</button>
                     <button class="action-btn retweet"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg> 0</button>
                     <button class="action-btn like"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> 0</button>
                </div>
            `;

            streamContainer.prepend(article);
            inputElement.value = '';
            document.getElementById('image-preview-container').style.display = 'none';
            pollContainer.style.display = 'none';

            // Re-init features
            if (typeof setupCommentSystem === 'function') setupCommentSystem(article);

            showToast('Post published!', 'success');
        });
    }
    const opt2 = document.getElementById('poll-opt-2').value || 'Option 2';

    if (content.trim() || hasImage || hasPoll) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.style.animation = 'slideInDown 0.5s ease';

        let imageHTML = '';
        if (hasImage) {
            imageHTML = `<img src="${imageSrc}" style="width:100%; border-radius:12px; margin-top:12px; border:1px solid var(--border-subtle);">`;
        }

        let pollHTML = '';
        if (hasPoll) {
            pollHTML = `
                        <div class="poll-widget" style="margin-top:12px; border:1px solid var(--border-subtle); border-radius:12px; padding:12px;">
                            <div class="poll-option" style="margin-bottom:8px; padding:8px; background:rgba(255,255,255,0.05); border-radius:8px; cursor:pointer;" onclick="this.style.background='var(--primary)'; this.style.color='white';">
                                <div style="display:flex; justify-content:space-between;">
                                    <span>${opt1}</span>
                                    <span>0%</span>
                                </div>
                                <div style="height:4px; background:rgba(255,255,255,0.1); margin-top:4px; border-radius:2px;"></div>
                            </div>
                            <div class="poll-option" style="padding:8px; background:rgba(255,255,255,0.05); border-radius:8px; cursor:pointer;" onclick="this.style.background='var(--primary)'; this.style.color='white';">
                                <div style="display:flex; justify-content:space-between;">
                                    <span>${opt2}</span>
                                    <span>0%</span>
                                </div>
                                <div style="height:4px; background:rgba(255,255,255,0.1); margin-top:4px; border-radius:2px;"></div>
                            </div>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">Total votes: 0 • 1 day left</div>
                        </div>
                    `;
        }

        article.innerHTML = `
                   <div class="post-header">
                        <div class="user-info">
                            <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');"></div>
                            <div class="user-meta">
                                <span class="name">Felix Admin</span>
                                <span class="username">@felix_admin</span>
                            </div>
                        </div>
                        <div class="more-options">...</div>
                    </div>
                    <div class="post-content">
                        ${content}
                        ${imageHTML}
                        ${pollHTML}
                    </div>
                    <div class="post-actions">
                         <button class="action-btn comment">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            0
                        </button>
                        <button class="action-btn retweet">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                            0
                        </button>
                         <button class="action-btn like">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            0
                        </button>
                         <button class="action-btn share">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        </button>
                        <!-- Phase 5: Analytics & Save -->
                        <button class="action-btn analytics" title="View Insights">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        </button>
                        <button class="action-btn save" title="Save to Collections">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        </button>
                    </div>
                `;

        streamContainer.insertBefore(article, streamContainer.firstChild);
        inputElement.value = '';
        newBtnPost.style.display = 'none';

        // Clear Image
        document.getElementById('remove-image').click();
        // Close Poll
        pollContainer.style.display = 'none';
        document.getElementById('poll-opt-1').value = '';
        document.getElementById('poll-opt-2').value = '';

        // Check Schedule
        const scheduleInput = document.getElementById('schedule-input');
        if (scheduleInput && scheduleInput.value) {
            showToast(`Post scheduled for ${new Date(scheduleInput.value).toLocaleString()}`, 'info');
            scheduleInput.style.display = 'none';
            scheduleInput.value = '';
        } else {
            showToast('Post published!', 'success');
        }
    }
});
    }

// --- FOLLOW SYSTEM LOGIC --- //
// Delegate for all follow buttons
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-follow')) {
        const btn = e.target;
        btn.classList.toggle('following');

        if (btn.classList.contains('following')) {
            btn.textContent = 'Following';
            showToast('Followed user', 'success');
            // Update stats if we are on profile page (mock logic)
            // In a real app we'd check if this button belongs to the user we are viewing
        } else {
            btn.textContent = 'Follow';
        }
    }
});

// Initialize
setupStoryViewer();

// --- THE BIG 5 FEATURES LOGIC --- //

// 2. Post Context Menu
const setupContextMenus = () => {
    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.more-options')) {
            document.querySelectorAll('.post-context-menu').forEach(m => m.classList.remove('show'));
        }
    });

    // Delegate click for dynamic posts
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.more-options')) {
            const btn = e.target.closest('.more-options');
            // Remove existing menu if any
            const existing = btn.querySelector('.post-context-menu');

            // Hide others
            document.querySelectorAll('.post-context-menu').forEach(m => {
                if (m !== existing) m.classList.remove('show');
            });

            if (existing) {
                existing.classList.toggle('show');
            } else {
                const menu = document.createElement('div');
                menu.className = 'post-context-menu show';
                menu.innerHTML = `
                        <div class="context-item save-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            Save Post
                        </div>
                        <div class="context-item hide-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            Hide Post
                        </div>
                        <div class="context-item danger">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            Report
                        </div>
                    `;
                btn.appendChild(menu);

                // Attach logic to items
                menu.querySelector('.save-btn').onclick = (ev) => {
                    ev.stopPropagation();
                    showToast('Post saved to collections', 'success');
                    menu.classList.remove('show');
                };
                menu.querySelector('.hide-btn').onclick = (ev) => {
                    ev.stopPropagation();
                    const post = btn.closest('.post-card');
                    post.style.transition = 'all 0.3s';
                    post.style.opacity = '0';
                    post.style.transform = 'scale(0.9)';
                    setTimeout(() => post.remove(), 300);
                    showToast('Post hidden', 'info');
                };
            }
        }
    });
};
setupContextMenus();

// 3. Search Suggestions
const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
searchInputs.forEach(input => {
    // Prevent double wrapping
    if (input.parentNode.classList.contains('search-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'search-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.innerHTML = `
            <div class="search-item">
                <div class="avatar" style="width:32px; height:32px; background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=Sam');"></div>
                <span>Sam Smith</span>
            </div>
             <div class="search-item">
                <div class="avatar" style="width:32px; height:32px; background-image: url('https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah');"></div>
                <span>Sarah Jenkins</span>
            </div>
             <div class="search-item">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Search for "<span>...</span>"</span>
            </div>
        `;
    wrapper.appendChild(dropdown);

    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            dropdown.classList.add('show');
            dropdown.querySelector('span span').textContent = input.value;
        } else {
            dropdown.classList.remove('show');
        }
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) dropdown.classList.remove('show');
    });
});


// 4. Functional Profile Tabs
const tabs = document.querySelectorAll('.profile-tabs .tab-item');
if (tabs.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const feed = document.getElementById('feed-stream');
            if (!feed) return;

            feed.style.opacity = '0.5';
            setTimeout(() => {
                feed.style.opacity = '1';
                showToast(`Switched to ${tab.textContent}`, 'info');
            }, 200);
        });
    });
}

// --- REACTION & CONFETTI SYSTEM --- //
const triggerConfetti = () => {
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 3 + 2;
        piece.style.animation = `fall ${duration}s linear forwards`;
        document.body.appendChild(piece);

        // Simple fall animation via Keyframes injected or JS loop
        // Since we lack CSS keyframes for fall, let's inject them once
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.innerHTML = `
                    @keyframes fall {
                        to { transform: translateY(100vh) rotate(720deg); }
                    }
                `;
            document.head.appendChild(style);
        }

        setTimeout(() => piece.remove(), duration * 1000);
    }
};

// Note: We need to attach reaction logic to Post Cards
// Since we dynamically create posts, we use delegation or re-attach.
// Let's modify the Like Button listener to handle reactions if we click the emojis
// But CSS :hover handles the popup display. We just need to handle clicks on emojis.

// Delegate Reaction Clicks
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('reaction-emoji')) {
        e.stopPropagation();
        const btn = e.target.closest('.action-btn.like');
        const type = e.target.textContent;

        // Update Button
        btn.innerHTML = `${type} 101`; // Mock count increase
        btn.classList.add('active');

        // Trigger Confetti
        triggerConfetti();
        showToast(`Reacted with ${type}`, 'success');
    }
});

// Helper to Inject Reaction Popup into Like Buttons
// Calling this whenever we add new posts would be ideal, or just running it periodically
const injectReactions = () => {
    document.querySelectorAll('.action-btn.like').forEach(btn => {
        if (!btn.querySelector('.reactions-popup')) {
            const popup = document.createElement('div');
            popup.className = 'reactions-popup';
            popup.innerHTML = `
                    <span class="reaction-emoji">❤️</span>
                    <span class="reaction-emoji">😂</span>
                    <span class="reaction-emoji">😮</span>
                    <span class="reaction-emoji">🔥</span>
                `;
            btn.appendChild(popup);
        }
    });
};
// Run initially and set an observer or just recall it
injectReactions();
setInterval(injectReactions, 2000); // Polling for new posts (simple solution)

// 5. Premium Share Modal
if (!document.querySelector('.share-modal')) {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
            <div class="share-card">
                <div class="share-header">
                    <div class="share-title">Share Post</div>
                    <div class="share-close">&times;</div>
                </div>
                <div class="share-link-box">
                    <input type="text" class="share-url" value="https://orbit.social/p/839201" readonly>
                    <button class="btn-copy">Copy</button>
                </div>
                <div class="share-grid">
                    <div class="share-item">
                        <div class="share-icon-circle" style="background:#1da1f2;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </div>
                        <span style="font-size:12px;">Twitter</span>
                    </div>
                     <div class="share-item">
                        <div class="share-icon-circle" style="background:#1877f2;">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </div>
                        <span style="font-size:12px;">Facebook</span>
                    </div>
                     <div class="share-item">
                        <div class="share-icon-circle" style="background:#0a66c2;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </div>
                        <span style="font-size:12px;">LinkedIn</span>
                    </div>
                     <div class="share-item">
                        <div class="share-icon-circle" style="background:#ea4335;">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <span style="font-size:12px;">Email</span>
                    </div>
                </div>
            </div>
        `;
    document.body.appendChild(shareModal);

    const close = shareModal.querySelector('.share-close');
    const copy = shareModal.querySelector('.btn-copy');

    const closeModal = () => shareModal.classList.remove('active');

    close.addEventListener('click', closeModal);
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) closeModal();
    });

    copy.addEventListener('click', () => {
        showToast('Link copied to clipboard', 'success');
        closeModal();
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.action-btn.share')) {
            shareModal.classList.add('active');
        }
    });
};
setupContextMenus();

// --- PHASE 2: PROFILE CUSTOMIZATION --- //
const setupProfileCustoms = () => {
    // Banner Upload
    const bannerInput = document.getElementById('banner-upload');
    const bannerBtn = document.getElementById('btn-edit-banner');
    const cover = document.querySelector('.profile-cover');

    if (cover && bannerInput) {
        // Hover effect for edit button
        cover.addEventListener('mouseenter', () => { if (bannerBtn) bannerBtn.style.opacity = '1'; });
        cover.addEventListener('mouseleave', () => { if (bannerBtn) bannerBtn.style.opacity = '0'; });

        if (bannerBtn) bannerBtn.addEventListener('click', () => bannerInput.click());

        bannerInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    cover.style.backgroundImage = `url('${ev.target.result}')`;
                    cover.style.backgroundSize = 'cover';
                    cover.style.backgroundPosition = 'center';
                    localStorage.setItem('orbit_banner', ev.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Load saved banner
        const savedBanner = localStorage.getItem('orbit_banner');
        if (savedBanner) {
            cover.style.backgroundImage = `url('${savedBanner}')`;
            cover.style.backgroundSize = 'cover';
            cover.style.backgroundPosition = 'center';
        }
    }

    // Link Tree Toggle
    const linkToggle = document.getElementById('toggle-link-tree');
    const linkList = document.getElementById('link-tree-list');
    if (linkToggle && linkList) {
        linkToggle.addEventListener('click', () => {
            const isHidden = linkList.style.display === 'none';
            linkList.style.display = isHidden ? 'flex' : 'none';
            linkToggle.querySelector('span').textContent = isHidden ? '- Less links' : '+ 2 more links';
        });
    }
};
setupProfileCustoms();

// --- PHASE 3: PRIVACY & SAFETY --- //
const setupPrivacySafety = () => {
    // 1. Settings Toggles
    const toggle2FA = document.getElementById('toggle-2fa');
    const toggleSensitive = document.getElementById('toggle-sensitive');

    if (toggle2FA) {
        toggle2FA.checked = localStorage.getItem('orbit_2fa') === 'true';
        toggle2FA.addEventListener('change', (e) => {
            localStorage.setItem('orbit_2fa', e.target.checked);
            showToast(e.target.checked ? '2FA Enabled' : '2FA Disabled', 'success');
        });
    }

    if (toggleSensitive) {
        toggleSensitive.checked = localStorage.getItem('orbit_sensitive') === 'true';
        const applyBlur = (isBlur) => {
            document.documentElement.style.setProperty('--blur-amount', isBlur ? '15px' : '0px');
            // We'll use a CSS class approach for images
            document.body.classList.toggle('blur-mode', isBlur);
        };

        // Initial Load
        applyBlur(toggleSensitive.checked);

        toggleSensitive.addEventListener('change', (e) => {
            localStorage.setItem('orbit_sensitive', e.target.checked);
            applyBlur(e.target.checked);
            showToast('Content Sensitivity Updated', 'info');
        });
    }

    // 2. Block User Logic (Profile Page)
    const btnBlock = document.getElementById('btn-block-user');
    if (btnBlock) {
        // For demo, we show it if we are clicking around or just let user toggle it
        // Typically this button is on OTHER profiles. We are on "Self" profile.
        // Let's make it visible just for the "Simulated" experience if user wants to test it?
        // Or better: Leave it hidden but accessible via code/console for now, 
        // OR show it if we visited a "different" profile. 
        // Since we only have static pages, let's just make it do something if it WERE visible.
        btnBlock.addEventListener('click', () => {
            const isBlocked = btnBlock.classList.contains('blocked');
            if (isBlocked) {
                btnBlock.textContent = 'Block User';
                btnBlock.classList.remove('blocked');
                btnBlock.style.background = 'var(--bg-card)';
                btnBlock.style.color = '#ef4444';
                showToast('User Unblocked', 'success');
            } else {
                btnBlock.textContent = 'Unblock';
                btnBlock.classList.add('blocked');
                btnBlock.style.background = '#ef4444';
                btnBlock.style.color = 'white';
                showToast('User Blocked', 'error'); // Red toast
            }
        });
        // Show it for demo purposes?
        // btnBlock.style.display = 'block'; 
    }

    // 3. Comment Filtering (Global Helper)
    window.filterComment = (text) => {
        const badWords = ['spam', 'hate', 'bad', 'stupid']; // Simple list
        let filtered = text;
        badWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            filtered = filtered.replace(regex, '****');
        });
        return filtered;
    };

    // Inject sensitive blur CSS if not present
    if (!document.getElementById('safety-style')) {
        const style = document.createElement('style');
        style.id = 'safety-style';
        style.innerHTML = `
                .blur-mode img { filter: blur(var(--blur-amount)); transition: filter 0.3s; }
                .blur-mode img:hover { filter: blur(0); }
                .blur-mode .profile-avatar-large, 
                .blur-mode .avatar { filter: none !important; } /* Don't blur avatars */
            `;
        document.head.appendChild(style);
    }
};
setupPrivacySafety();

// --- PHASE 4: DISCOVERY & NETWORK --- //
const setupDiscoveryNetwork = () => {
    // 1. Explore Map Toggle
    const btnMap = document.getElementById('btn-map-view');
    const btnCloseMap = document.getElementById('close-map');
    const exploreContent = document.getElementById('explore-content');
    const mapContainer = document.getElementById('map-view-container');

    if (btnMap && exploreContent && mapContainer) {
        btnMap.addEventListener('click', () => {
            exploreContent.style.display = 'none';
            mapContainer.style.display = 'block';
            // Reset other tabs styling if we had active class logic
        });

        if (btnCloseMap) btnCloseMap.addEventListener('click', () => {
            mapContainer.style.display = 'none';
            exploreContent.style.display = 'block';
        });
    }

    // 2. Refresh Who To Follow
    const btnRefresh = document.getElementById('refresh-suggested');
    const userList = document.getElementById('suggested-users-list');
    if (btnRefresh && userList) {
        const names = ['Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Jamie'];
        const roles = ['Designer', 'Developer', 'Artist', 'Writer', 'Musician'];

        btnRefresh.addEventListener('click', () => {
            // Animate
            btnRefresh.style.transform = 'rotate(180deg)';
            setTimeout(() => btnRefresh.style.transform = 'rotate(0deg)', 500);

            // Show Empty State (since we don't have real other users)
            userList.innerHTML = `<div style="padding:10px; text-align:center; color:var(--text-muted); font-size:13px;">No suggestions available.</div>`;
        });
    }

    // 3. QR Code Modal
    const btnQR = document.getElementById('btn-qr-code');
    if (btnQR) {
        // Check if modal exists, if not create it
        if (!document.getElementById('qr-modal')) {
            const modal = document.createElement('div');
            modal.id = 'qr-modal';
            modal.className = 'modal-overlay';
            modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2000; align-items:center; justify-content:center; backdrop-filter:blur(5px);';
            modal.innerHTML = `
                    <div style="background:var(--bg-card); padding:32px; border-radius:24px; text-align:center; border:1px solid var(--border-subtle);">
                        <div style="margin-bottom:16px;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=orbit.social/@felix_admin" style="border-radius:12px; border:4px solid white;">
                        </div>
                        <h3 style="margin-bottom:4px;">@felix_admin</h3>
                        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Scan to follow me on Orbit</p>
                        <button id="close-qr" style="background:var(--border-subtle); color:var(--text-main); border:none; padding:8px 24px; border-radius:20px; cursor:pointer;">Close</button>
                    </div>
                `;
            document.body.appendChild(modal);

            modal.querySelector('#close-qr').addEventListener('click', () => modal.style.display = 'none');
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        }

        btnQR.addEventListener('click', (e) => {
            e.preventDefault(); // Stop link click
            document.getElementById('qr-modal').style.display = 'flex';
        });
    }
};
setupDiscoveryNetwork();

// --- LAYOUT SWITCHER --- //
const setupLayoutSwitcher = () => {
    const btns = document.querySelectorAll('.layout-btn');
    const feed = document.getElementById('feed-stream');

    const setLayout = (mode) => {
        // Reset UI
        btns.forEach(b => {
            b.style.color = 'var(--text-muted)';
            b.classList.remove('active');
        });

        const active = document.querySelector(`.layout-btn[data-layout="${mode}"]`);
        if (active) {
            active.style.color = 'var(--primary)';
            active.classList.add('active');
        }

        // Apply Class
        if (mode === 'compact') {
            feed.classList.add('feed-compact');
            // Inject CSS for compact mode if needed
            if (!document.getElementById('compact-style')) {
                const s = document.createElement('style');
                s.id = 'compact-style';
                s.innerHTML = `
                        .feed-compact .post-card { padding: 12px; gap: 8px; }
                        .feed-compact .avatar { width: 32px; height: 32px; }
                        .feed-compact .post-content { font-size: 14px; margin-left: 42px; margin-top: -10px;}
                        .feed-compact .post-header { margin-bottom: 4px; }
                        .feed-compact .post-actions { margin-left: 42px; margin-top: 4px; }
                     `;
                document.head.appendChild(s);
            }
        } else {
            feed.classList.remove('feed-compact');
        }
        localStorage.setItem('orbit_layout', mode);
    };

    btns.forEach(btn => btn.addEventListener('click', () => setLayout(btn.dataset.layout)));

    // Load Layout
    const savedLayout = localStorage.getItem('orbit_layout');
    if (savedLayout) setLayout(savedLayout);
};
setupLayoutSwitcher();

// --- PHASE 5: PROFESSIONAL & UTILITY --- //
const setupProFeatures = () => {
    // 1. Scheduler Toggle
    const btnSchedule = document.getElementById('btn-schedule');
    const inputSchedule = document.getElementById('schedule-input');
    if (btnSchedule && inputSchedule) {
        btnSchedule.addEventListener('click', () => {
            const isHidden = inputSchedule.style.display === 'none';
            inputSchedule.style.display = isHidden ? 'block' : 'none';
            if (isHidden) inputSchedule.focus();
        });
    }

    // 2. Event Delegation for New Buttons (Analytics, Save)
    document.body.addEventListener('click', (e) => {
        // Analytics
        if (e.target.closest('.action-btn.analytics')) {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);';
            modal.innerHTML = `
                    <div style="background:var(--bg-card); padding:24px; border-radius:16px; width:300px; border:1px solid var(--border-subtle);">
                        <h3 style="margin-bottom:16px;">Post Insights</h3>
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                            <span>👀 Impressions</span>
                            <b>1,245</b>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                            <span>❤️ Likes</span>
                            <b>124</b>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                            <span>🔗 Clicks</span>
                            <b>45</b>
                        </div>
                        <div style="height:100px; background:rgba(255,255,255,0.05); border-radius:8px; display:flex; align-items:end; padding:8px; gap:4px;">
                            <div style="flex:1; background:var(--primary); height:30%;"></div>
                            <div style="flex:1; background:var(--primary); height:50%;"></div>
                            <div style="flex:1; background:var(--primary); height:80%;"></div>
                            <div style="flex:1; background:var(--primary); height:40%;"></div>
                            <div style="flex:1; background:var(--primary); height:90%;"></div>
                        </div>
                    </div>
                `;
            document.body.appendChild(modal);
            modal.addEventListener('click', () => modal.remove());
        }

        // Save / Bookmark
        if (e.target.closest('.action-btn.save')) {
            const btn = e.target.closest('.action-btn.save');
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.style.color = 'var(--primary)';
                btn.querySelector('svg').style.fill = 'var(--primary)';
                showToast('Post saved to Collections', 'success');
            } else {
                btn.style.color = 'inherit';
                btn.querySelector('svg').style.fill = 'none';
                showToast('Removed from Collections', 'info');
            }
        }
    });
    // 3. Settings: Data Saver & Verification
    const toggleData = document.getElementById('toggle-datasaver');
    const btnVerify = document.getElementById('btn-request-verify');

    if (toggleData) {
        toggleData.checked = localStorage.getItem('orbit_datasaver') === 'true';
        toggleData.addEventListener('change', (e) => {
            localStorage.setItem('orbit_datasaver', e.target.checked);
            showToast(e.target.checked ? 'Data Saver Enabled' : 'Data Saver Disabled', 'info');
        });
    }

    if (btnVerify) {
        btnVerify.addEventListener('click', () => {
            btnVerify.textContent = 'Requested';
            btnVerify.disabled = true;
            btnVerify.style.opacity = '0.5';
            showToast('Verification request sent for review', 'success');
        });
    }
};
setupProFeatures();

// End of App


// --- EDIT PROFILE FEATURE --- //
const setupEditProfile = () => {
    const editBtn = document.querySelector('.edit-profile-btn');

    // Elements to update (might exist even without edit btn, on profile page)
    const profileName = document.getElementById('profile-name');
    const profileHandle = document.getElementById('profile-handle'); // Added handle just in case
    const profileBio = document.getElementById('profile-bio');
    const profileWebsite = document.getElementById('profile-website');

    // Load Persistence
    const loadProfile = () => {
        const savedName = localStorage.getItem('orbit_profile_name');
        const savedBio = localStorage.getItem('orbit_profile_bio');
        const savedWebsite = localStorage.getItem('orbit_profile_website');

        if (savedName && profileName) profileName.textContent = savedName;
        if (savedBio && profileBio) profileBio.textContent = savedBio;
        if (savedWebsite && profileWebsite) profileWebsite.textContent = savedWebsite;
    };
    loadProfile(); // Run on load

    if (!editBtn) return;

    if (!document.querySelector('.edit-profile-modal')) {
        const modalHTML = `
                <div class="edit-profile-modal" id="edit-modal">
                    <div class="edit-card">
                        <div class="share-header">
                            <div class="share-title">Edit Profile</div>
                            <div class="share-close" id="close-edit">&times;</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" id="edit-name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea class="form-textarea" id="edit-bio" rows="3"></textarea>
                        </div>
                         <div class="form-group">
                            <label class="form-label">Website</label>
                            <input type="text" class="form-input" id="edit-website">
                        </div>
                        <div class="edit-actions">
                            <button class="btn-secondary" id="cancel-edit">Cancel</button>
                            <button class="btn-primary" id="save-profile">Save</button>
                        </div>
                    </div>
                </div>
            `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit');
    const cancelBtn = document.getElementById('cancel-edit');
    const saveBtn = document.getElementById('save-profile');

    const inputName = document.getElementById('edit-name');
    const inputBio = document.getElementById('edit-bio');
    const inputWebsite = document.getElementById('edit-website');

    const openModal = () => {
        if (profileName) inputName.value = profileName.textContent;
        if (profileBio) inputBio.value = profileBio.textContent.trim();
        if (profileWebsite) inputWebsite.value = profileWebsite.textContent;
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    const saveProfile = () => {
        // Update DOM
        if (profileName) profileName.textContent = inputName.value;
        if (profileBio) profileBio.textContent = inputBio.value;
        if (profileWebsite) profileWebsite.textContent = inputWebsite.value;

        // Save Logic
        localStorage.setItem('orbit_profile_name', inputName.value);
        localStorage.setItem('orbit_profile_bio', inputBio.value);
        localStorage.setItem('orbit_profile_website', inputWebsite.value);

        closeModal();
        showToast('Profile updated & saved', 'success');
    };

    editBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveProfile);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
};
// --- DISPLAY CUSTOMIZATION --- //
const setupDisplayCustomization = () => {
    const btnOpen = document.getElementById('open-display-btn');
    // Handle potential duplicate IDs on some pages by selecting querySelectorAll if needed, 
    // but ID suggests unique. Let's use getElementById.

    // If we have multiple buttons (e.g. mobile/desktop split), we should use class.
    // But simplified for now:
    const btnsOpen = document.querySelectorAll('#open-display-btn');

    const modal = document.getElementById('display-modal');
    if (!modal) return; // Should be in HTML now

    const closeBtn = document.getElementById('close-display');
    const saveBtn = document.getElementById('save-display');

    // Color Swatches
    const swatches = modal.querySelectorAll('.color-swatch');
    // Theme Toggles
    const themeBtns = modal.querySelectorAll('.theme-btn');
    // Font Range
    const fontRange = document.getElementById('font-range');

    // Open Modal
    btnsOpen.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    // Close Modal
    const close = () => modal.style.display = 'none';
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (saveBtn) saveBtn.addEventListener('click', () => {
        showToast('Display settings saved', 'success');
        close();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    // Color Logic
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Remove active border from all
            swatches.forEach(s => s.style.border = '2px solid transparent');
            // Add active to current
            swatch.style.border = '2px solid white';

            // Set Color
            const color = swatch.dataset.color;
            document.documentElement.style.setProperty('--primary', color);
            localStorage.setItem('orbit_color', color);
        });
    });

    // Theme Logic
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--text-muted)';
            });
            btn.classList.add('active');
            btn.style.background = 'var(--bg-card)'; // approximate active
            btn.style.color = 'white';

            const theme = btn.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('orbit_theme', theme);
        });
    });

    const applyTheme = (theme) => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.style.setProperty('--bg-body', '#f0f2f5');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--text-main', '#0f1419');
            root.style.setProperty('--text-muted', '#536471');
            root.style.setProperty('--border-subtle', '#eff3f4');
        } else if (theme === 'dim') {
            root.style.setProperty('--bg-body', '#15202b');
            root.style.setProperty('--bg-card', '#192734');
            root.style.setProperty('--text-main', '#ffffff');
            root.style.setProperty('--text-muted', '#8899a6');
            root.style.setProperty('--border-subtle', '#38444d');
        } else {
            // Dark (Default)
            root.style.setProperty('--bg-body', 'black');
            root.style.setProperty('--bg-card', '#1e1e1e');
            root.style.setProperty('--text-main', '#e7e9ea');
            root.style.setProperty('--text-muted', '#71767b');
            root.style.setProperty('--border-subtle', '#2f3336');
        }
    };

    // Font Logic
    if (fontRange) {
        fontRange.addEventListener('input', (e) => {
            const size = e.target.value;
            document.documentElement.style.fontSize = size + 'px';
            localStorage.setItem('orbit_font_size', size);
        });
    }

    // Init Load
    const savedColor = localStorage.getItem('orbit_color');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary', savedColor);
        swatches.forEach(s => {
            s.style.border = (s.dataset.color === savedColor) ? '2px solid white' : '2px solid transparent';
        });
    }

    const savedTheme = localStorage.getItem('orbit_theme');
    if (savedTheme) {
        applyTheme(savedTheme);
        themeBtns.forEach(b => {
            const isActive = b.dataset.theme === savedTheme;
            b.classList.toggle('active', isActive);
            if (isActive) {
                b.style.background = 'var(--bg-card)';
                b.style.color = 'white';
            } else {
                b.style.background = 'transparent';
                b.style.color = 'var(--text-muted)';
            }
        });
    }

    const savedFontSize = localStorage.getItem('orbit_font_size');
    if (savedFontSize && fontRange) {
        fontRange.value = savedFontSize;
        document.documentElement.style.fontSize = savedFontSize + 'px';
    }

};
setupDisplayCustomization();

setupEditProfile();

// --- PROFILE TABS LOGIC --- //
const setupProfileTabs = () => {
    const tabs = document.querySelectorAll('.profile-tabs .tab-item');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove Active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add Active to Clicked
            tab.classList.add('active');

            // Hide all contents
            contents.forEach(c => c.style.display = 'none');

            // Show Target
            const targetId = tab.dataset.tab;
            const targetContent = document.querySelector(`.tab-content[data-content="${targetId}"]`);
            if (targetContent) {
                targetContent.style.display = 'block';
                // Grid fix for media
                if (targetId === 'media') {
                    targetContent.style.display = 'grid';
                }
            }
        });
    });
};
setupProfileTabs();

// --- LIVE STREAMING FEATURE ---
const setupLiveStream = () => {
    const btnGoLive = document.getElementById('btn-go-live');
    const liveModal = document.getElementById('live-modal');
    const btnEnd = document.getElementById('end-live');
    const cameraContainer = liveModal ? liveModal.querySelector('div[style*="background:#222"]') : null;

    if (btnGoLive && liveModal && cameraContainer) {
        let liveTimer;
        let viewerInterval;
        let seconds = 0;
        let currentStream = null;

        // Setup Video Element once
        let videoEl = document.createElement('video');
        videoEl.style.width = '100%';
        videoEl.style.height = '100%';
        videoEl.style.objectFit = 'cover';
        videoEl.autoplay = true;
        videoEl.muted = true; // Local preview muted to prevent feedback

        // Initial Content
        const initialContent = cameraContainer.innerHTML;

        const startStream = async () => {
            try {
                // Reset View
                cameraContainer.innerHTML = '';
                cameraContainer.appendChild(videoEl);

                // Request Media
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                currentStream = stream;
                videoEl.srcObject = stream;

                showToast('🔴 You are live! (Camera & Mic Active)', 'success');
            } catch (err) {
                console.error("Camera Error:", err);
                showToast('⚠️ Camera/Mic access denied or error.', 'error');
                // Fallback to offline look
                cameraContainer.innerHTML = initialContent;
            }
        };

        const stopStream = () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
            }
            videoEl.srcObject = null;
        };

        btnGoLive.addEventListener('click', () => {
            liveModal.style.display = 'flex';
            startStream();

            // Start Timer
            const timerDisplay = liveModal.querySelector('span:nth-child(3)');
            if (timerDisplay) {
                seconds = 0;
                liveTimer = setInterval(() => {
                    seconds++;
                    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const secs = (seconds % 60).toString().padStart(2, '0');
                    timerDisplay.textContent = `${mins}:${secs}`;
                }, 1000);
            }

            // Simulate Viewers
            const viewerDisplay = liveModal.querySelector('div[style*="right:20px"] div');
            if (viewerDisplay) {
                let viewers = 0;
                viewerInterval = setInterval(() => {
                    viewers += Math.floor(Math.random() * 5);
                    viewerDisplay.textContent = `👁️ ${viewers}`;
                }, 2000);
            }
        });

        btnEnd.addEventListener('click', () => {
            stopStream();
            liveModal.style.display = 'none';
            clearInterval(liveTimer);
            clearInterval(viewerInterval);
            if (typeof showToast === 'function') showToast(`Stream ended. Duration: ${seconds}s`, 'info');

            // Restore placeholder
            cameraContainer.innerHTML = initialContent;
        });
    }
};
setupLiveStream();

// --- MARKETPLACE FEATURE ---
const setupMarket = () => {
    const buyBtns = document.querySelectorAll('.btn-buy');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');

    let count = 0;
    let items = [];

    if (buyBtns.length > 0) {
        buyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent card click

                // Simple animation
                btn.textContent = 'Added!';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = 'Buy Now';
                    btn.style.background = 'var(--primary)';
                }, 1000);

                // Logic
                count++;
                if (cartCount) cartCount.textContent = count;

                const card = btn.closest('.product-card');
                const title = card.querySelector('.product-title').textContent;
                items.push(title);

                if (typeof showToast === 'function') showToast(`Added ${title} to cart`, 'success');
            });
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (count === 0) {
                if (typeof showToast === 'function') showToast('Cart is empty', 'info');
            } else {
                alert(`Cart Summary:\n${items.join('\n')}\n\nTotal Items: ${count}`);
            }
        });
    }
};
setupMarket();

});
