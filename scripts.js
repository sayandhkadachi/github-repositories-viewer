
      const githubToken = "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";

      async function fetchUserData(page) {
        const username = document.getElementById("username").value;
        const reposPerPage = document.getElementById("reposPerPage").value;
        const userDetailsContainer = document.getElementById("userDetails");
        const repositoriesContainer = document.getElementById("repositories");
        const loader = document.getElementById("loader");
        const paginationContainer = document.getElementById("pagination");

        userDetailsContainer.innerHTML = "";
        repositoriesContainer.innerHTML = "";
        loader.style.display = "block";
        paginationContainer.innerHTML = "";

        try {
          const userResponse = await fetch(
            `https://api.github.com/users/${username}`,
            {
              headers: {
                Authorization: `Bearer ${githubToken}`,
              },
            }
          );

          const userData = await userResponse.json();

          const userAvatar = document.createElement("img");
          userAvatar.src = userData.avatar_url;

          const userName = document.createElement("h2");
          userName.textContent = userData.login;
          const userBio = document.createElement("p");
          userBio.textContent = userData.bio || "No bio available."
          const userLocation = document.createElement("p");
          userLocation.textContent = `Location: ${userData.location || "N/A"}`;

         
          const linksContainer = document.createElement("div");
          linksContainer.classList.add("links-container");

          
          const githubLinkContainer = document.createElement("div");
          githubLinkContainer.classList.add("link-container");

      
          const twitterLinkContainer = document.createElement("div");
          twitterLinkContainer.classList.add("link-container");

          const githubLink = document.createElement("a");
          githubLink.href = userData.html_url;
          githubLink.textContent = "GitHub";
          githubLink.classList.add("github-link");
          githubLinkContainer.appendChild(githubLink);
          

          const twitterHandle = userData.twitter_username
            ? userData.twitter_username
            : null;

          
          if (twitterHandle) {
          
            const twitterLinkContainer = document.createElement("div");
            twitterLinkContainer.classList.add("link-container");

            const twitterLink = document.createElement("a");
            twitterLink.href = `https://twitter.com/${twitterHandle}`;
            twitterLink.textContent = `@${twitterHandle}`;
            twitterLink.classList.add("link");
            twitterLinkContainer.appendChild(twitterLink);

            linksContainer.appendChild(twitterLinkContainer);
          }

       
          linksContainer.appendChild(githubLinkContainer);
          linksContainer.appendChild(twitterLinkContainer);

          userDetailsContainer.appendChild(userAvatar);
          userDetailsContainer.appendChild(userName);
          userDetailsContainer.appendChild(userBio);
          userDetailsContainer.appendChild(userLocation);
          userDetailsContainer.appendChild(document.createElement("br"));
          userDetailsContainer.appendChild(linksContainer);

      

          const repositoriesResponse = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${githubToken}`,
              },
            }
          );
          const repositoriesData = await repositoriesResponse.json();

          if (Array.isArray(repositoriesData)) {
            for (const repo of repositoriesData) {
              const repoContainer = document.createElement("div");
              repoContainer.classList.add("repository");

              const repoName = document.createElement("h3");
              repoName.textContent = repo.name;

              const repoDescription = document.createElement("p");
              repoDescription.textContent =
                repo.description || "No description available.";

            
              const topicsContainer = document.createElement("div");
              topicsContainer.classList.add("topics-container");

            
              const topicsLabel = document.createElement("strong");
              topicsLabel.textContent = "Topics: ";

           
              const topicsListContainer = document.createElement("div");
              topicsListContainer.classList.add("topics-list-container");

              const topicsResponse = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/topics`,
                {
                  headers: {
                    Accept: "application/vnd.github.mercy-preview+json", 
                  },
                }
              );

              const topicsData = await topicsResponse.json();

             
              topicsData.names.forEach((topic) => {
                const topicElement = document.createElement("span");
                topicElement.classList.add("topic");
                topicElement.textContent = topic;
                topicsListContainer.appendChild(topicElement);
              });

             
              topicsContainer.appendChild(topicsLabel);
              topicsContainer.appendChild(topicsListContainer);

            
              repoContainer.appendChild(repoName);
              repoContainer.appendChild(repoDescription);
              repoContainer.appendChild(topicsContainer);

           

              repositoriesContainer.appendChild(repoContainer);
            }

            const totalPages = Math.ceil(userData.public_repos / reposPerPage);
            for (let i = 1; i <= totalPages; i++) {
              const pageLink = document.createElement("a");
              pageLink.href = "#";
              pageLink.classList.add("page-link");
              pageLink.textContent = i;
              pageLink.addEventListener("click", () => fetchUserData(i));

              if (i === page) {
                pageLink.classList.add("active");
              }

              paginationContainer.appendChild(pageLink);
            }
          } else {
            console.error(
              "Invalid data structure for repositories:",
              repositoriesData
            );
          }

          const accountDetailsDiv = document.getElementById("originalContent");
          const repositoriesDiv = document.getElementById("newContent");
          accountDetailsDiv.style.display = "none";
          repositoriesDiv.style.display = "block";
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          loader.style.display = "none";
        }
      }

      function searchUser() {
        const username = document.getElementById("username").value;
        fetchUserData(1);
        const accountDetailsDiv = document.getElementById("originalContent");
        const repositoriesDiv = document.getElementById("newContent");
        accountDetailsDiv.style.display = "none";
        repositoriesDiv.style.display = "block";
      }

      function clearData() {
        const userDetailsContainer = document.getElementById("userDetails");
        const repositoriesContainer = document.getElementById("repositories");
        const paginationContainer = document.getElementById("pagination");

        userDetailsContainer.innerHTML = "";
        repositoriesContainer.innerHTML = "";
        paginationContainer.innerHTML = "";
        const accountDetailsDiv = document.getElementById("originalContent");
        const repositoriesDiv = document.getElementById("newContent");
        accountDetailsDiv.style.display = "block";
        repositoriesDiv.style.display = "none";
      }

      function searchUserNavbar() {
        const username = document.getElementById("navbarSearch").value;
        document.getElementById("username").value = username;
        fetchUserData(1);

        const accountDetailsDiv = document.getElementById("originalContent");
        const repositoriesDiv = document.getElementById("newContent");

        accountDetailsDiv.style.display = "none";
        repositoriesDiv.style.display = "block";
      }

      document
        .querySelector(".navbar-brand b")
        .addEventListener("click", function () {
          const accountDetailsDiv = document.getElementById("originalContent");
          const repositoriesDiv = document.getElementById("newContent");

          accountDetailsDiv.style.display = "block";
          repositoriesDiv.style.display = "none";
        });

      function toggleContent(originalContentId, newContentId) {
        document.getElementById(originalContentId).style.display = "none";
        document.getElementById(newContentId).style.display = "block";
      }
