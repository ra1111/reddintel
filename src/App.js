import React, { useState,useRef,useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Player } from '@lottiefiles/react-lottie-player';
import { saveAs } from 'file-saver';
import { IoCopyOutline, IoCloudDownloadOutline } from 'react-icons/io5';
function App() {
  const [subreddit, setSubreddit] = useState('');
  const [error, setError] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading status
  const lottiePlayer = useRef(null);
  // Update subreddit state and clear error when the input changes
  const handleInputChange = (event) => {
    setSubreddit(event.target.value);
    if (error) setError('');
  };
  const LottiePlayerComponent = React.forwardRef((props, ref) => (
    <Player
        ref={ref}
        autoplay={true}
        loop={true}
        controls={false}
        src="https://raw.githubusercontent.com/ra1111/shopifyreact/main/animation_lkey1cvo.json"
        style={{ height: '300px', width: '300px' }}
    />
));
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(responseText);
    alert('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};
  // Function to export text as a file
  const handleExport = () => {
    const blob = new Blob([responseText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'subreddit_analysis.txt');
  };

useEffect(() => {
  if (loading && lottiePlayer.current) {
      lottiePlayer.current.play();
  } else if (lottiePlayer.current) {
      lottiePlayer.current.pause();
  }
}, [loading]);
  // Function to submit the subreddit to the API and handle the response
  const handleSubmit = async () => {
    // Trim any leading or trailing spaces
    const trimmedSubreddit = subreddit.trim();
  
    if (!trimmedSubreddit) {
      setError('Please enter a subreddit.');
      return;
    }
    
    // Check if the subreddit starts with a forward slash '/'
    if (!trimmedSubreddit.startsWith('/')) {
      setError('Please include a  "/" in the subreddit name.');
      return;
    }
  
    setLoading(true); // Indicate that data fetching has started
  
    try {
      const response = await axios.post("https://us-central1-foresight-club.cloudfunctions.net/onReddit", {
        sub: trimmedSubreddit
      });
      setResponseText(response.data); // Update response text with data from the API
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setLoading(false); // Data fetching is complete
    }
  };
  

  return (
    <div className="App">
           {loading && (
        <div className="modal">
          <Player
            ref={lottiePlayer}
            autoplay
            loop
            controls={false}
            src="https://raw.githubusercontent.com/ra1111/shopifyreact/main/animation_lkey1cvo.json"
            style={{ height: '700px', width: '700px' }}
          />
        </div>
      )}
<header className="App-header">
  <h1>Unlock Subreddit Insights</h1>
  <p>Discover the pulse of any subreddit in  seconds. Trends, insights, and strategic ideas at your fingertips.</p>
</header>

      <main className={responseText ? "main-content" : "main-content-empty"}>
        <div className="search-container">
          <input
            className="search-bar"
            type="text"
            placeholder="/startups"
            value={subreddit}
            onChange={handleInputChange}
          />
         
          <button
  className={`search-button ${loading ? 'loading' : ''}`}
  onClick={handleSubmit}
  disabled={loading}
>
  {loading ? 'Loading...' : 'Get Results'}
</button>
{error && <div className="error-message">{error}</div>}
        </div>
        
        {/* Display the server response */}
        {responseText && (
          <>
            <section className="content-section">
              
              <ReactMarkdown>{responseText}</ReactMarkdown>
              {/* Add icons for copy and export at the end of the summary */}
              <div className="icon-actions">
                <IoCopyOutline className="icon-button" onClick={handleCopy} title="Copy to clipboard" />
                <IoCloudDownloadOutline className="icon-button" onClick={handleExport} title="Export as file" />
              </div>
            </section>
    
          </>
        )}
      </main>
    </div>
  );
}

export default App;
