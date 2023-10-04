let reviewBoxVisible = false;
let fullscreenClosed = false;  // New flag

function createReviewBox(thumbnails) {  // Added 'thumbnails' as a parameter
    const reviewBox = document.createElement('div');
    reviewBox.className = 'reviewBoxClass';
    reviewBox.id = 'adloxsReviewBox';
    reviewBox.style.width = '400px';
    reviewBox.style.border = '1px solid grey';
    reviewBox.style.padding = '10px';
    reviewBox.style.position = 'fixed';
    reviewBox.style.top = '72px';
    reviewBox.style.left = '20.5%';
    reviewBox.style.backgroundColor = '#fff';
    reviewBox.style.zIndex = '1000';
    reviewBox.style.overflowY = 'auto';

    const baseHeightPerThumbnail = 80;  // Assume each thumbnail container needs about 150px. Adjust as needed.
    const totalHeight = thumbnails.length * baseHeightPerThumbnail;
    const maxHeight = window.innerHeight * 0.8;  // Let's set a max height to 80% of the viewport height

    reviewBox.style.height = Math.min(totalHeight, maxHeight) + 'px';  // Set the height based on thumbnail count but don't exceed maxHeight
    
    if (totalHeight > maxHeight) {
        reviewBox.style.overflowY = 'auto';  // If the content exceeds the max height, make it scrollable
    }

    return reviewBox;
}

function fetchThumbnailsForChannel(channelId) {
    const channelRef = firebase.database().ref(`AL_Discord_ch_ids/${channelId}`);
    channelRef.once('value').then(snapshot => {
        const discordChannelIds = Object.values(snapshot.val() || {});
        const thumbnailPromises = discordChannelIds.map(fetchThumbnailsForDiscordId);

        Promise.all(thumbnailPromises).then(allThumbnails => {
            const thumbnails = [].concat(...allThumbnails);  // Flatten the array
            populateReviewBox(thumbnails);
        });
    }).catch(error => {
        console.error("Error fetching Discord channel IDs:", error);
    });
}

function fetchThumbnailsForDiscordId(discordChannelId) {
    return firebase.database().ref(`thumbnails/${discordChannelId}`).once('value')
        .then(snapshot => Object.values(snapshot.val() || {}).map(entry => ({ src: entry.thumbnail, description: 'Description here' }))) // You can customize the description if needed
        .catch(error => {
            console.error("Error fetching thumbnails:", error);
            return [];
        });
}


function addReviewButton() {
    const existingButton = document.querySelector('ytcp-home-button');
    if (existingButton && !document.querySelector('.reviewButton')) {
        const reviewBtn = document.createElement('button');
        reviewBtn.innerText = 'Review';
        reviewBtn.className = 'reviewButton';
        reviewBtn.style.backgroundColor = 'red';  
        reviewBtn.style.color = 'white'; 

        // Modify the button size, round the edges, move it down, and remove the border
        reviewBtn.style.height = '25px';           // Set the height. Adjust as needed.
        reviewBtn.style.padding = '0 5px';         // Reduce padding to make button smaller overall. Adjust as needed.
        reviewBtn.style.borderRadius = '5px';      // Rounded edges. Adjust for more or less rounding.
        reviewBtn.style.marginTop = '7px';         // Move the button down slightly. Adjust as needed.
        reviewBtn.style.border = 'none';  

function addReviewButton() {
    const existingButton = document.querySelector('ytcp-home-button');
    if (existingButton && !document.querySelector('.reviewButton')) {
        const reviewBtn = document.createElement('button');
        reviewBtn.innerText = 'Review';
        reviewBtn.className = 'reviewButton';
        // ... rest of your button styling ...

        reviewBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (reviewBoxVisible) {
                const existingReviewBox = document.querySelector('.reviewBoxClass');
                if (existingReviewBox) existingReviewBox.remove();
                reviewBoxVisible = false;
            } else {
                fetchThumbnailsForChannel(channelId).then(thumbnails => {
                    const reviewBox = createReviewBox(thumbnails);

                    thumbnails.forEach((thumbnail, index) => {
                        const container = document.createElement('div');
                        container.style.display = 'flex';
                        container.style.alignItems = 'center';
                        container.style.marginBottom = '10px';
                        if (index !== thumbnails.length - 1) { 
                            container.style.borderBottom = '1px solid lightgrey';
                        }
                        container.style.paddingBottom = '10px';

                        const img = document.createElement('img');
                        img.src = thumbnail.src;
                        img.style.display = 'block';
                        img.width = 120;
                        img.style.marginRight = '15px';
                        img.style.borderRadius = '5px';
                        img.style.cursor = 'pointer';
                        img.className = 'thumbnail-image';
                        img.setAttribute('data-src', thumbnail.src);
                        img.onclick = function() {
                            viewImageFullscreen(thumbnail.src, thumbnail);
                        };

                        const desc = document.createElement('div');
                        desc.innerText = thumbnail.description;
                        desc.style.flexGrow = '1';
                        desc.style.fontSize = '14px';
                        desc.className = 'description';

                        container.appendChild(img);
                        container.appendChild(desc);
                        reviewBox.appendChild(container);
                    });

                    document.body.appendChild(reviewBox);
                    reviewBoxVisible = true;
                }).catch(error => {
                    console.error('Error fetching thumbnails:', error);
                });
            }
        });

        existingButton.insertAdjacentElement('afterend', reviewBtn);
    }

// ... The rest of your content.js, no change ...


function viewImageFullscreen(imageUrl, thumbnail) {
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.style.position = 'fixed';
    fullscreenDiv.style.top = '0';
    fullscreenDiv.style.left = '0';
    fullscreenDiv.style.width = '100vw';
    fullscreenDiv.style.height = '100vh';
    fullscreenDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
    fullscreenDiv.style.zIndex = '2000';
    fullscreenDiv.style.display = 'flex';
    fullscreenDiv.style.justifyContent = 'center';
    fullscreenDiv.style.alignItems = 'center';
    fullscreenDiv.id = 'fullscreenDiv';

    const largeImage = document.createElement('img');
    largeImage.src = imageUrl;
    largeImage.style.maxWidth = '90%';
    largeImage.style.maxHeight = '90%';
    largeImage.style.borderRadius = '10px';
    largeImage.style.marginRight = '20px';  // Create space between the image and the buttons

    // Create the approve button
    const approveBtn = document.createElement('button');
    approveBtn.innerText = '✔';
    approveBtn.style.backgroundColor = 'green';
    approveBtn.style.color = 'white';
    approveBtn.style.marginBottom = '10px';
    approveBtn.style.border = 'none';
    approveBtn.style.padding = '5px 10px';  // Increase the padding to make the button larger
    approveBtn.style.borderRadius = '4px';  // Round the button corners
    approveBtn.style.fontSize = '20px';  // Increase the font size for visibility
    approveBtn.onclick = function(event) {
    event.stopPropagation();
    console.log(thumbnail.src + ' approved');
    document.body.removeChild(fullscreenDiv);

    // New: Apply approved styles
    const associatedThumbnailContainer = document.querySelector(`[data-src="${thumbnail.src}"]`).parentNode;
    if (associatedThumbnailContainer) {

        associatedThumbnailContainer.classList.add('approved');
        associatedThumbnailContainer.classList.remove('revised');

    }
};
    // Create the revise button
    const reviseBtn = document.createElement('button');
    reviseBtn.innerText = '✖';
    reviseBtn.style.backgroundColor = 'red';
    reviseBtn.style.color = 'white';
    reviseBtn.style.border = 'none';
    reviseBtn.style.padding = '5px 10px';  // Increase the padding to make the button larger
    reviseBtn.style.borderRadius = '4px';  // Round the button corners
    reviseBtn.style.fontSize = '20px';  // Increase the font size for visibility
    reviseBtn.onclick = function(event) {
    event.stopPropagation();
    const comment = prompt('Enter your revision request:', '');
    if (comment) {
        console.log('Revision for ' + thumbnail.src + ':', comment);
    }
    document.body.removeChild(fullscreenDiv);

    // New: Apply revised styles
    const associatedThumbnailContainer = document.querySelector(`[data-src="${thumbnail.src}"]`).parentNode;
    if (associatedThumbnailContainer) {

        associatedThumbnailContainer.classList.add('revised');
        associatedThumbnailContainer.classList.remove('approved');

    }
};


    // Container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'flex-end';  // Align buttons to the right
    buttonContainer.style.marginRight = '10px';  // Add some space on the right

    buttonContainer.appendChild(approveBtn);
    buttonContainer.appendChild(reviseBtn);

    fullscreenDiv.appendChild(largeImage);
    fullscreenDiv.appendChild(buttonContainer);  // Append the buttons to the fullscreenDiv

    document.body.appendChild(fullscreenDiv);

    fullscreenDiv.onclick = function(event) {
        event.stopPropagation();
        document.body.removeChild(fullscreenDiv);
        fullscreenClosed = true; 

        setTimeout(() => {
            fullscreenClosed = false;
        }, 10);
    };
}

function injectStyles() {
    console.log("Injecting styles...");
    const styles = `
        .approved .description {
            text-decoration: line-through;
            color: green;
        }

        .approved .thumbnail-image {
            filter: brightness(50%) sepia(1) hue-rotate(100deg); /* green filter */
        }

        .revised .description {
            text-decoration: line-through;
            color: red;
        }

        .revised .thumbnail-image {
            filter: brightness(70%) sepia(1) hue-rotate(0deg); /* red filter */
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}


injectStyles(); // manually invoke the function

document.addEventListener('click', function (event) {
    const reviewBox = document.getElementById('adloxsReviewBox');
    const fullscreenDiv = document.getElementById('fullscreenDiv');

    if (reviewBoxVisible && reviewBox && 
        !reviewBox.contains(event.target) && 
        !event.target.matches('.reviewButton') && 
        (!fullscreenDiv || !fullscreenDiv.contains(event.target)) && 
        !fullscreenClosed) {
        reviewBox.remove();
        reviewBoxVisible = false;
    }
});

document.addEventListener('DOMContentLoaded', addReviewButton);

const reviewButtonObserver = new MutationObserver(addReviewButton);
reviewButtonObserver.observe(document.body, { childList: true, subtree: true });


    const url = window.location.href;
const match = url.match(/channel\/(UC[^?\/]+)/);

let channelId;
if (match && match[1]) {
    channelId = match[1];
    console.log("Channel ID:", channelId);
} else {
    console.error("Could not extract channel ID from URL");
}
