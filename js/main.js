$(document).ready(function() {
    var previousContent = ''; // Variable to store the previous content of the text file

    // Function to read the text file and update content if changed
    function checkAndUpdateTextFile() {
        $.get('song_list.txt', function(data) {
            if (data !== previousContent) {
                previousContent = data;
                searchYouTubeVideo(data);
            }
        }).fail(function() {
            // Handle failure to load the text file
        });
    }
    // Function to read and parse the text file
    function readTextFile(file, callback) {
        $.get(file, function(data) {
            callback(data);
        }, 'text').fail(function() {
            // Handle failure to load the text file
            callback("");
        });
    }

    // Function to extract name and artist from the text
    function extractInfo(text) {
        var lines = text.split('\n');
        var name = "";
        var artist = "";

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("Name:")) {
                name = lines[i].replace("Name:", "").trim();
            } else if (lines[i].startsWith("Artist:")) {
                artist = lines[i].replace("Artist:", "").trim();
            }
        }

        $('#videoName').text(name);
        $('#videoArtist').text(artist);

        // Search for the video on YouTube
    }

    // Function to load default video if no information found
    function loadDefaultVideo() {
        $('#videoName').text("Default Video Name");
        $('#videoArtist').text("Default Artist");
    }

    // Function to search for a video on YouTube
    function searchYouTubeVideo(query) {
            const song = `${query} official music video`;
			const proxyUrl = `/youtube-search?part=snippet&type=video&videoEmbeddable=true&maxResults=1&q=${encodeURIComponent(song)}&key=AIzaSyCrfYC6Ofh3FGBZ1PkwM6G9TAOljgFMCGc`;

			fetch(proxyUrl)
				.then(response => response.json())
				.then(data => {
					if (data.items && data.items.length > 0) {
						const videoId = data.items[0].id.videoId;
						const embedLink = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0`;
						document.getElementById("youtubeLink").src = embedLink;
                        const iframe = document.getElementById("youtubeLink");
                        iframe.src = "";
                        setTimeout(() => {
                            iframe.src = embedLink;
                        }, 100);
					} else {
                        // Geen video gevonden, toon je eigen fallback
                        const iframe = document.getElementById("youtubeLink");
                        iframe.style.display = "none"; // Verberg iframe
                        const fallback = document.getElementById("fallbackImage");
                        fallback.style.display = "block"; // Laat fallback zien
                    }
				})
				.catch(err => {
					console.error("Fout bij proxy call:", err);
					
				});
		
        //gapi.load('client', function() {
            //gapi.client.init({
               // apiKey: 'AIzaSyCrfYC6Ofh3FGBZ1PkwM6G9TAOljgFMCGc', // Replace with your API key
               // discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            //}).then(function() {
               // return gapi.client.youtube.search.list({
                //    q: query,
                //    type: 'video',
                //    part:'id',
                //    maxResults:1
                //});
           // }).then(function(response) {
                //var videoId = response.result.items[0].id.videoId;
              //  var youtubeLink = 'https://www.youtube.com/embed/' + videoId +'?autoplay=1&controls=0';
              //  console.log(youtubeLink);

                // Display the YouTube link
             //   $('#youtubeLink').attr('src', youtubeLink);

                // You can also embed the video player or do other actions with the video here.
           // });
      //  });
	  
    }
    checkAndUpdateTextFile();

    // Refresh the page every 60 seconds
    setInterval(function() {
        checkAndUpdateTextFile();
    }, 1000);
});