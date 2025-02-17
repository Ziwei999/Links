// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'into-the-mirror' // The “slug” is just the end of the URL


// let placeChannelInfo = (data) => {
// 	let title = document.querySelector('#channel-title')
// 	console.log(title)
// 	title.innerHTMLm = data.title

// 	let channelDescription = document.querySelector('#channel-description')
// 	channelDescription.innerHTML = data.metadata.description
// }

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

// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	console.log(block)
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')
	let channelPhoto= document.querySelector('#photo-channel')
	let channelVideo= document.querySelector('#video-channel')
	let channelMusic= document.querySelector('#music-channel')
	let channelPdf= document.querySelector('#pdf-channel')
	let channelAudio= document.querySelector('#audio-channel')
	

	// Links!
	if (block.class == 'Link') {
		let linkItem = `
		<li>
				<p><em>Link</em></p>
				<picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src="${ block.image.original.url }">
				</picture>
				<h3>${ block.title }</h3>
				${ block.description_html }
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>`
			
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		// …up to you!
		let imageItem = `
		<li class="flip-card">
                <div class="content">
                    <div class="card-front">
                        <img src="${block.image.original.url}" alt="${block.title}">
                    </div>
                    <div class="card-back">
                        <h3>${block.title}</h3>
                        <p>${block.description_html}</p>
                        <a href="${block.image.url}">See the original ↗</a>
                    </div>
                </div>
            </li>

		`

		channelPhoto.insertAdjacentHTML('beforeend', imageItem)
	}

	// Text!
	else if (block.class == 'Text') {
		// …up to you!
		console.log(block.content_html)
		let textItem = `
		<li class="photo">
            <a href="#"><h3>$(block.content_html)</h3></a>
            <p>Mirror in Photograph</p>
        </li>
		`
		channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li>
				
					<p><em>Video</em></p>
					<p controls src="${ block.attachment.url }"></p>
					<img src="${block.image.original.url}" alt="${block.title}">
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
			let pdfItem = `
				<li>
				
				<p><em>Article</em></p>
                <object data="${block.attachment.url}" type="application/pdf" width="600" height="400">
                <p>Your browser does not support PDFs. <a href="${block.attachment.url}">Download the PDF</a>.</p>
            </object>
			<img src="${block.image.original.url}" alt="${block.title}">
				</li>
			`
			channelPdf.insertAdjacentHTML('beforeend', pdfItem)
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></audio>
					
				</li>
				`
				channelMusic.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li>					
					<p><em>Linked Video</em></p>
					${ block.embed.html }
				</li>
				`
			channelVideo.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
			let LinkedAudioItem = 
			`
			<li>
			<img src="${block.image.thumb.url}"</img>
			</li>
			`
			channelAudio.insertAdjacentHTML('beforeend', LinkedAudioItem)
		}
	}
}

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		// console.log(data.title) // Pass the data to the first function
		// placeChannelInfo(data)

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		
		// let title = document.querySelector('#channel-title')
		// console.log(title)
		// title.innerHTMLm = data.title

		// let channelDescription = document.querySelector('#channel-description')
		// channelDescription.innerHTML = data.metadata.description

	})

