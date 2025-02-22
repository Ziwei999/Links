// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'into-the-mirror' // The “slug” is just the end of the URL

let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	// let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	// channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
    
}

let renderPhotos = (data) =>{
    let channelPhoto= document.querySelector('#photo-channel')
    data.forEach(block =>{
        if (block.class == 'Image') {
            // …up to you!
            let imageItem = `
            
                <li class="flip-card">
                    <div class="content">
                        <div class="card-front">
                            <img src="${block.image.original.url}" alt="${block.title}">
                        </div>
                        <div class="card-back">
                            <h3>${block.title}</h3>
                            <button class="toggle-button">See Description</button>
                            <div class="modal" style="display:none;">
                                <div class="modal-content">
                                    <span class="close-button">&times;</span>
                                    <div class="photo-content">
                                        <p>${block.description_html}</p>
                                    </div>
                                </div> 
                            </div> 
                        </div> 
                    </div>
                </li>
                
    
            `
    
            channelPhoto.insertAdjacentHTML('beforeend', imageItem)
        }
    })

    channelPhoto.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (event.deltaY > 0) {
                card.querySelector('.content').style.transform = 'rotateY(180deg)';
            } else {
                card.querySelector('.content').style.transform = 'rotateY(0deg)';
            }
        });
    });
   
    channelPhoto.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle-button')) {
            let modal = event.target.closest('.card-back').querySelector('.modal');
            if (modal) {
                modal.style.display = "block"; // Show the modal
            }
        }
    });

    //This code from ChatGPT
    channelPhoto.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-button')) {
            let modal = event.target.closest('.modal');
            if (modal) {
                modal.style.display = "none"; // Close the modal
            }
        }

        // Close the modal when clicking outside of the modal content
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none"; // Close the modal if clicking outside
        }
    });
}

let renderVideos = (data) =>{
    let channelVideo= document.querySelector('#video-channel')
    data.forEach(block =>{
        if (block.class == 'Media') {
            let embed = block.embed.type
    
            // Linked video!
            if (embed.includes('video')) {
                // …still up to you, but here’s an example `iframe` element:
                let linkedVideoItem =
                    `
                    <li class="flip-card">	
                        <div class="content">
                            <div class="card-front">
                                <img src="${block.image.thumb.url}"</img>
                            </div>
                            <div class="card-back">
                               <h3>${block.title}</h3>
                               <p>${block.description_html}</p>
                               <button class="toggle-button">Watch Video</button>
                                <div class="modal" style="display:none;">
                                    <div class="modal-content">
                                        <span class="close-button">&times;</span>
                                        <div class="video-content">
                                            ${block.embed.html}
                                        </div>
                                    </div>
                                </div>
                               
                            </div>
                        </div>				
                        
                    </li>
                    `
                channelVideo.insertAdjacentHTML('beforeend', linkedVideoItem)
            }
        }
    
    })
    channelVideo.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle-button')) {
            let modal = event.target.closest('.card-back').querySelector('.modal');
            if (modal) {
                modal.style.display = "block"; // Show the modal
            }
        }
    });

    //This code from ChatGPT
    channelVideo.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-button')) {
            let modal = event.target.closest('.modal');
            if (modal) {
                modal.style.display = "none"; // Close the modal
            }
        }

        // Close the modal when clicking outside of the modal content
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none"; // Close the modal if clicking outside
        }
    });
}

let renderMusic = (data) =>{
   
    let channelMusic= document.querySelector('#music-channel')
    let channelAudio= document.querySelector('#audio-channel')
    data.forEach(block =>{
        if (block.class == 'Attachment'){
            let attachment = block.attachment.content_type
            if (attachment.includes('audio')) {
                // …still up to you, but here’s an `audio` element:
                let audioItem =
                    `
                    <li class="flip-card">
                        <div class="content">
                             <div class="card-front">
                                 <p><em>Audio</em></p>
                                 <p>${block.description_html}</p>
                             </div>
                             <div class="card-back">
                                
                                 <audio controls src="${ block.attachment.url }"></audio>
                             </div>
                             
                        </div>         
                        
                        
                    </li>
                    `
                    channelAudio.insertAdjacentHTML('beforeend', audioItem)
            }
        }
        else if (block.class === 'Media' && block.embed) {
            let embedType = block.embed.type;
            if (embedType.includes('rich')) {
                // …up to you!
                let LinkedAudioItem = 
                `
                <li class="flip-card">
                    <div class="content">
                        <div class="card-front">
                            <img src="${block.image.thumb.url}"</img>
                        </div>
                        <div class="card-back">
                             ${block.embed.html}
                        </div>
                    </div>
                </li>
                `
                channelMusic.insertAdjacentHTML('beforeend', LinkedAudioItem)
            }
        }
        
    })
}

let renderArticles = (data) =>{
    
    let channelPdf= document.querySelector('#pdf-channel')
    let channelBlocks= document.querySelector('#text-channel')
    
    data.forEach(block =>{

        if (block.class == 'Attachment'){
            let attachment = block.attachment.content_type
            if (attachment.includes('pdf')) {
                // …up to you!
                let pdfItem = `
                    <li  class="flip-card">

                         <div class="content">
                             <div class="card-front">
                                 <img src="${block.image.original.url}" alt="${block.title}">
                             </div>
                             <div class="card-back">
                                 <a href="${block.attachment.url}">Download the PDF</a>
                             </div>
                        </div>
                    
                    
                    </li>
                `
                channelPdf.insertAdjacentHTML('beforeend', pdfItem)
            }
        }
        else if (block.class == 'Text') {
            
            // …up to you!
            console.log(block.content_html)
            let shortContent = block.content_html.length > 100 ? block.content_html.substring(0, 100) + '...' : block.content_html;
            let textItem = `
            <li  class="flip-card">
                 <div class="content">
                    <div class="card-front">
                        <p>${block.description_html}</p>
                       
                    </div>
                    <div class="card-back">
                       <p class="content-text">${shortContent}
                        <button class="toggle-button">Show More</button>
                       </p>
                       <div class="modal" style="display:none;">
                                <div class="modal-content">
                                    <span class="close-button">&times;</span>
                                    <div id="modal-text">${block.content_html}</div>
                                </div>
                            </div>
                    </div>
                </div>      
            </li>
            `
            channelBlocks.insertAdjacentHTML('beforeend', textItem)
            
        }
    })

    //This code from ChatGPT
    channelBlocks.addEventListener('click', (event) => {
        if (event.target.classList.contains('toggle-button')) {
            let modal = event.target.closest('.card-back').querySelector('.modal');
            if (modal) {
                modal.style.display = "block"; // Show the modal
            }
        }
    });

   //This code from ChatGPT
    channelBlocks.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-button')) {
            let modal = event.target.closest('.modal');
            if (modal) {
                modal.style.display = "none"; // Close the modal
            }
        }

        // Close the modal when clicking outside of the modal content
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none"; // Close the modal if clicking outside
        }
    });
   
}

let renderBlock = (block) => {
    if (window.location.pathname.includes('arena.html')) {
        placeChannelInfo(block);
    } else if (window.location.pathname.includes('photo.html')) {
        renderPhotos([block]);
    } else if (window.location.pathname.includes('video.html')) {
        renderVideos([block]);
    } else if (window.location.pathname.includes('music.html')) {
        renderMusic([block]);
    } else if (window.location.pathname.includes('article.html')) {
        renderArticles([block]);
    }
}

document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('wheel', (event) => {
        // Prevent default scrolling behavior
        event.preventDefault();
        
        // Check the scroll direction
        if (event.deltaY > 0) {
            card.querySelector('.content').style.transform = 'rotateY(180deg)'; // Flip to back
        } else {
            card.querySelector('.content').style.transform = 'rotateY(0deg)'; // Flip to front
        }
    });
});

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		// console.log(data.title) // Pass the data to the first function
		// placeChannelInfo(data)

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach(renderBlock) 
			// console.log(block) // The data for a single block
			// renderBlock(block) // Pass the single block data to the render function
		

		
		// let title = document.querySelector('#channel-title')
		// console.log(title)
		// title.innerHTMLm = data.title

		// let channelDescription = document.querySelector('#channel-description')
		// channelDescription.innerHTML = data.metadata.description

	})

