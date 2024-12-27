document.addEventListener('DOMContentLoaded', () => {


    const searchForm = document.querySelector('#search_form');
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(searchForm);
        const search = formData.get('search');
        const newPosts = await getPosts(search);
        refreshPosts(newPosts);
    });

    const form = document.querySelector('#post_form');
    form.addEventListener('submit', async (e) => {
        console.log('submitted');
        e.preventDefault();

        const submitButton = form.querySelector('#submit_button');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Uploading...';

        const formData = new FormData(form);

        await fetch('/posts', {
            method: 'POST',
            body: formData
        });
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    })

    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        const postID = post.id;
        const commentForm = post.querySelector('.comment_form');
        addSubmitForm(commentForm, postID);
    });

});

function addSubmitForm(commentForm, postID) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(commentForm);
        const content = formData.get('content');
        const comment = {
            postID: postID,
            authorID: '67354d9ae9a39ec7d653d375',
            content
        };
        console.log(comment);
        commentForm.reset();
        fetch('/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        });
    });
}

function refreshPosts(posts) {
    const postsContainer = document.querySelector('#posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.id = post._id;
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image">'` : ''}
            <form class="comment_form">
                <input type="text" name="content" placeholder="Comment">
                <button type="submit">Submit</button>
            </form>
        `;
        postsContainer.appendChild(postElement);
        addSubmitForm(postElement.querySelector('.comment_form'), post._id);
    })
}

async function getPosts(searchParams) {
    let url = '/posts';
    if (searchParams) {
        url += `?q=${searchParams}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
document.addEventListener("DOMContentLoaded", function() {
    // Get all post elements
    const posts = document.querySelectorAll('.post');
  
    // Apply a random color to each post
    posts.forEach(post => {
      const randomColor = getRandomColor();
      post.style.backgroundColor = randomColor;
    });
  
    // Function to generate a random color
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    
});
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to all toggle buttons
    document.querySelectorAll('.toggle-comments').forEach(button => {
        button.addEventListener('click', function() {
            // Find all comments in this post
            const post = this.closest('.post');
            const comments = post.querySelectorAll('.comment');
            const commentForm = post.querySelector('.comment_form');
            const commentsHeader = post.querySelector('h3');
            
            // Toggle visibility of comments and form
            [commentsHeader, ...comments].forEach(element => {
                if (element.style.display === 'none') {
                    element.style.display = 'block';
                    button.textContent = 'Hide Comments';
                } else {
                    element.style.display = 'none';
                    button.textContent = 'Show Comments';
                }
            });
            
            // Toggle form separately to maintain layout
            if (commentForm.style.display === 'none') {
                commentForm.style.display = 'flex';
            } else {
                commentForm.style.display = 'none';
            }
        });
    });
    
    // Initially hide all comments
    document.querySelectorAll('.post').forEach(post => {
        const comments = post.querySelectorAll('.comment');
        const commentForm = post.querySelector('.comment_form');
        const commentsHeader = post.querySelector('h3');
        
        [commentsHeader, ...comments, commentForm].forEach(element => {
            element.style.display = 'none';
        });
    });
});