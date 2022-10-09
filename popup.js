// Upon popup startup, fetch previous chats 
alert("Fetching previous chats");
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {        
    //Get url
    url = tabs[0].url;
    loadChat(url);
});

function loadChat(url){
    // Send request for SQL database data to php file
    const XHR = new XMLHttpRequest();
    XHR.open('GET', 'http://localhost/Test/index.php?url='+url , true);
    XHR.send();
    var response = "";
    XHR.onload = function (){
        if (XHR.status != 200){
            alert(`Error ${XHR.status}: ${XHR.statusText}`);
        }
        else{
            
            response = XHR.responseText;
            document.getElementById("chatdisplay").innerHTML  += response;
        }
    }
}


// Process for entering chats and uploading chats
const submitBtn = document.getElementById("submitBtn")

function sendData(message, url){
    // Create XML Http Request and send data from form to php file on localhost server
    const XHR = new XMLHttpRequest();
    XHR.addEventListener('load', (event) => {
        console.log('Yeah! Data sent and response loaded.');
    });

    // Alert in case of an error (used for debugging)
    XHR.addEventListener('error', (event) => {
        alert('Oops! Something went wrong.');
    });

    // Set up our request and add the required HTTP header for form data POST requests
    XHR.open('POST', 'http://localhost/Test/index.php', true);
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // Finally, send our data.
    

    XHR.send("message="+message + "&url=" + url);

    // Checking in console to see that our php file got a response
    XHR.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("Got response 200!");
        }
    }
}

submitBtn.addEventListener("click", 
    function(e){
        // Prevents submit button from working as it should and posting to provided .php file
        e.preventDefault(); 

        // Get message from text area, send it to backend, and clear text area
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            
            //Get url
            url = tabs[0].url;
            message = document.getElementById("text").value;
            sendData(message, url);
            document.getElementById("text").value = "";
            document.getElementById("chatdisplay").innerHTML  += "Anonymous: " + message + "<br>";
        });
        
        return false;
    }

,false);