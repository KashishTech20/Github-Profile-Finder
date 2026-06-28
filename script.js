 const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

searchBtn.addEventListener("click", () => {
    const username = searchInput.value.trim();

    if (username === "") {
        error.textContent = "Please enter a GitHub username.";
        profile.innerHTML = "";
        return;
    }

    getProfile(username);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

async function getProfile(username) {

    loading.style.display = "block";
    error.textContent = "";
    profile.innerHTML = "";

    try {

        const userResponse = await fetch(`https://api.github.com/users/${username}`);

        if (!userResponse.ok) {
            throw new Error("User not found.");
        }

        const user = await userResponse.json();

        const repoResponse = await fetch(user.repos_url);

        const repos = await repoResponse.json();

        loading.style.display = "none";

        displayProfile(user, repos);

    } catch (err) {

        loading.style.display = "none";
        error.textContent = err.message;

    }

}

function displayProfile(user, repos) {

    let repoHTML = "";

    repos.slice(0, 6).forEach(repo => {

        repoHTML += `
            <div class="repo">
                <a href="${repo.html_url}" target="_blank">
                    ${repo.name}
                </a>

                <span>⭐ ${repo.stargazers_count}</span>
            </div>
        `;

    });

    profile.innerHTML = `

    <div class="profile-card">

        <div class="left">

            <img src="${user.avatar_url}" alt="${user.login}">

            <a href="${user.html_url}" target="_blank">
                Visit GitHub
            </a>

        </div>

        <div class="right">

            <h2>${user.name || "No Name"}</h2>

            <p class="username">@${user.login}</p>

            <p class="bio">
                ${user.bio || "No bio available."}
            </p>

            <div class="stats">

                <div class="stat">
                    <h3>${user.followers}</h3>
                    <p>Followers</p>
                </div>

                <div class="stat">
                    <h3>${user.following}</h3>
                    <p>Following</p>
                </div>

                <div class="stat">
                    <h3>${user.public_repos}</h3>
                    <p>Repositories</p>
                </div>

            </div>

            <div class="info">

                <p>
                    <i class="fas fa-map-marker-alt"></i>
                    ${user.location || "Not Available"}
                </p>

                <p>
                    <i class="fas fa-building"></i>
                    ${user.company || "Not Available"}
                </p>

                <p>
                    <i class="fas fa-link"></i>
                    ${user.blog ? `<a href="${user.blog}" target="_blank">${user.blog}</a>` : "Not Available"}
                </p>

                <p>
                    <i class="fas fa-calendar"></i>
                    Joined:
                    ${new Date(user.created_at).toDateString()}
                </p>

            </div>

            <div class="repo-section">

                <h3>Top Repositories</h3>

                ${repoHTML}

            </div>

        </div>

    </div>

    `;

}