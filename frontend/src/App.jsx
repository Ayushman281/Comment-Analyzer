import React, { useState } from 'react';
import axios from 'axios';

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">YouTube Comment Sentiment Analyzer</h1>
          <p className="text-gray-600">Analyze the sentiment of comments from any YouTube video</p>
        </header>
        <CommentAnalyzer />
      </div>
    </div>
  );
}

// Comment Analyzer Component
function CommentAnalyzer() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setShowInstructions(false);
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/fetch-comments', {
        youtube_url: url
      });
      
      setResults(response.data.results);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching comments');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Comments'
            )}
          </button>
        </form>
        {error && <p className="mt-3 text-red-500">{error}</p>}
      </div>

      <div className="p-6">
        {showInstructions && !results && !isLoading ? (
          <Instructions />
        ) : isLoading ? (
          <LoadingState />
        ) : results ? (
          <ResultsDisplay results={results} />
        ) : null}
      </div>
    </div>
  );
}

// Instructions Component
function Instructions() {
  return (
    <div className="text-center py-8">
      <div className="bg-indigo-50 rounded-lg p-6 inline-block">
        <svg className="h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-indigo-800 mb-2">How to use this tool:</h3>
        <ol className="text-left text-gray-600 space-y-2 ml-4">
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">1</span>
            <span>Find a YouTube video you want to analyze</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">2</span>
            <span>Copy the video URL from your browser</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">3</span>
            <span>Paste the URL in the input field above</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">4</span>
            <span>Click "Analyze Comments" to see sentiment results</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">Fetching and analyzing comments...</p>
    </div>
  );
}

// Results Display Component
function ResultsDisplay({ results }) {
  const [activeTab, setActiveTab] = useState('all');
  
  // Calculate sentiment stats
  const positiveCount = results.filter(r => r.sentiment_label === 2).length;
  const neutralCount = results.filter(r => r.sentiment_label === 1).length;
  const negativeCount = results.filter(r => r.sentiment_label === 0).length;
  const totalCount = results.length;
  
  // Filter comments based on active tab
  const filteredResults = activeTab === 'all' 
    ? results 
    : activeTab === 'positive' 
      ? results.filter(r => r.sentiment_label === 2)
      : activeTab === 'neutral'
        ? results.filter(r => r.sentiment_label === 1)
        : results.filter(r => r.sentiment_label === 0);

  return (
    <div>
      {/* Sentiment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SentimentCard 
          title="Total Comments" 
          count={totalCount} 
          color="bg-gray-100" 
          textColor="text-gray-800"
          onClick={() => setActiveTab('all')}
          active={activeTab === 'all'}
        />
        <SentimentCard 
          title="Positive" 
          count={positiveCount} 
          percentage={Math.round((positiveCount / totalCount) * 100)}
          color="bg-green-100" 
          textColor="text-green-800"
          onClick={() => setActiveTab('positive')}
          active={activeTab === 'positive'}
        />
        <SentimentCard 
          title="Neutral" 
          count={neutralCount} 
          percentage={Math.round((neutralCount / totalCount) * 100)}
          color="bg-blue-100" 
          textColor="text-blue-800"
          onClick={() => setActiveTab('neutral')}
          active={activeTab === 'neutral'}
        />
        <SentimentCard 
          title="Negative" 
          count={negativeCount} 
          percentage={Math.round((negativeCount / totalCount) * 100)}
          color="bg-red-100" 
          textColor="text-red-800"
          onClick={() => setActiveTab('negative')}
          active={activeTab === 'negative'}
        />
      </div>

      {/* Comment List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Comments ({filteredResults.length})
        </h3>
        
        {filteredResults.length === 0 ? (
          <p className="text-gray-500 italic py-4">No comments found in this category.</p>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <CommentCard key={index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Sentiment Card Component
function SentimentCard({ title, count, percentage, color, textColor, onClick, active }) {
  return (
    <div 
      className={`rounded-lg ${color} p-4 cursor-pointer transition-all ${active ? 'ring-2 ring-indigo-500 transform scale-105' : 'hover:shadow-md'}`}
      onClick={onClick}
    >
      <h4 className={`font-medium ${textColor}`}>{title}</h4>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-bold ${textColor}`}>{count}</span>
        {percentage !== undefined && (
          <span className={`${textColor} opacity-80`}>{percentage}%</span>
        )}
      </div>
    </div>
  );
}

// Comment Card Component
function CommentCard({ result }) {
  // Map sentiment label to text and colors
  const sentimentMap = {
    0: { label: 'Negative', color: 'bg-red-100', textColor: 'text-red-800', barColor: 'bg-red-500' },
    1: { label: 'Neutral', color: 'bg-blue-100', textColor: 'text-blue-800', barColor: 'bg-blue-500' },
    2: { label: 'Positive', color: 'bg-green-100', textColor: 'text-green-800', barColor: 'bg-green-500' }
  };
  
  const sentiment = sentimentMap[result.sentiment_label];
  
  // Extract probabilities
  const probabilities = result.sentiment_probabilities;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <p className="text-gray-800">{result.original_comment}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${sentiment.color} ${sentiment.textColor}`}>
          {sentiment.label}
        </span>
        
        <div className="flex-grow">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            {probabilities.map((prob, i) => (
              <div
                key={i}
                style={{ width: `${prob * 100}%` }}
                className={`h-full ${sentimentMap[i].barColor} float-left`}
              ></div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Negative: {Math.round(probabilities[0] * 100)}%</span>
            <span>Neutral: {Math.round(probabilities[1] * 100)}%</span>
            <span>Positive: {Math.round(probabilities[2] * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



// Sample data to visualize the frontend



// import React, { useState } from 'react';

// function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <header className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-indigo-800 mb-2">YouTube Comment Sentiment Analyzer</h1>
//           <p className="text-gray-600">Analyze the sentiment of comments from any YouTube video</p>
//         </header>
//         <CommentAnalyzer />
//       </div>
//     </div>
//   );
// }

// const MOCK_RESULTS = [
  // {
  //   "original_comment": "This video really helped me understand the topic, thank you so much for making this!",
  //   "cleaned_comment": "this video really helped me understand the topic thank you so much for making this",
  //   "sentiment_label": 2, // Positive
  //   "sentiment_probabilities": [0.05, 0.15, 0.8]
  // },
  // {
  //   "original_comment": "I don't think this explanation is clear enough, could you explain it better?",
  //   "cleaned_comment": "i dont think this explanation is clear enough could you explain it better",
  //   "sentiment_label": 0, // Negative
  //   "sentiment_probabilities": [0.7, 0.2, 0.1]
  // },
  // {
  //   "original_comment": "Just watched this video yesterday, interesting perspective.",
  //   "cleaned_comment": "just watched this video yesterday interesting perspective",
  //   "sentiment_label": 1, // Neutral
  //   "sentiment_probabilities": [0.2, 0.6, 0.2]
  // },
  // {
  //   "original_comment": "This is the best tutorial I've seen on this subject! Subscribed!",
  //   "cleaned_comment": "this is the best tutorial ive seen on this subject subscribed",
  //   "sentiment_label": 2, // Positive
  //   "sentiment_probabilities": [0.03, 0.07, 0.9]
  // },
  // {
  //   "original_comment": "The audio quality could be better, I had trouble hearing some parts.",
  //   "cleaned_comment": "the audio quality could be better i had trouble hearing some parts",
  //   "sentiment_label": 0, // Negative
  //   "sentiment_probabilities": [0.65, 0.3, 0.05]
  // },
  // {
  //   "original_comment": "I'll check out the resources you mentioned in the description.",
  //   "cleaned_comment": "ill check out the resources you mentioned in the description",
  //   "sentiment_label": 1, // Neutral
  //   "sentiment_probabilities": [0.1, 0.75, 0.15]
  // },
  // {
  //   "original_comment": "Wow, this changed my whole perspective! Thank you!",
  //   "cleaned_comment": "wow this changed my whole perspective thank you",
  //   "sentiment_label": 2, // Positive
  //   "sentiment_probabilities": [0.02, 0.18, 0.8]
  // }
// ];

// function CommentAnalyzer() {
//   const [url, setUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [results, setResults] = useState(null);
//   const [showInstructions, setShowInstructions] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!url.trim()) {
//       setError('Please enter a YouTube URL');
//       return;
//     }
    
//     setIsLoading(true);
//     setError('');
//     setShowInstructions(false);
    
//     setTimeout(() => {
//       try {
//         setResults(MOCK_RESULTS);
//       } catch (err) {
//         setError('An error occurred while fetching comments');
//       } finally {
//         setIsLoading(false);
//       }
//     }, 1500);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-xl overflow-hidden">
//       <div className="p-6 border-b border-gray-200">
//         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             placeholder="Paste YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
//             className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 disabled:opacity-70"
//           >
//             {isLoading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Analyzing...
//               </span>
//             ) : (
//               'Analyze Comments'
//             )}
//           </button>
//         </form>
//         {error && <p className="mt-3 text-red-500">{error}</p>}
//       </div>

//       <div className="p-6">
//         {showInstructions && !results && !isLoading ? (
//           <Instructions />
//         ) : isLoading ? (
//           <LoadingState />
//         ) : results ? (
//           <ResultsDisplay results={results} />
//         ) : null}
//       </div>
//     </div>
//   );
// }

// function Instructions() {
//   return (
//     <div className="text-center py-8">
//       <div className="bg-indigo-50 rounded-lg p-6 inline-block">
//         <svg className="h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <h3 className="text-lg font-medium text-indigo-800 mb-2">How to use this tool:</h3>
//         <ol className="text-left text-gray-600 space-y-2 ml-4">
//           <li className="flex items-start gap-2">
//             <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">1</span>
//             <span>Find a YouTube video you want to analyze</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">2</span>
//             <span>Copy the video URL from your browser</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">3</span>
//             <span>Paste the URL in the input field above</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <span className="inline-flex items-center justify-center rounded-full bg-indigo-200 h-5 w-5 text-xs font-medium text-indigo-800">4</span>
//             <span>Click "Analyze Comments" to see sentiment results</span>
//           </li>
//         </ol>
//       </div>
//     </div>
//   );
// }

// function LoadingState() {
//   return (
//     <div className="flex flex-col items-center justify-center py-12">
//       <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
//       <p className="text-gray-600">Fetching and analyzing comments...</p>
//     </div>
//   );
// }

// function ResultsDisplay({ results }) {
//   const [activeTab, setActiveTab] = useState('all');
  
//   const positiveCount = results.filter(r => r.sentiment_label === 2).length;
//   const neutralCount = results.filter(r => r.sentiment_label === 1).length;
//   const negativeCount = results.filter(r => r.sentiment_label === 0).length;
//   const totalCount = results.length;
  
//   const filteredResults = activeTab === 'all' 
//     ? results 
//     : activeTab === 'positive' 
//       ? results.filter(r => r.sentiment_label === 2)
//       : activeTab === 'neutral'
//         ? results.filter(r => r.sentiment_label === 1)
//         : results.filter(r => r.sentiment_label === 0);

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <SentimentCard 
//           title="Total Comments" 
//           count={totalCount} 
//           color="bg-gray-100" 
//           textColor="text-gray-800"
//           onClick={() => setActiveTab('all')}
//           active={activeTab === 'all'}
//         />
//         <SentimentCard 
//           title="Positive" 
//           count={positiveCount} 
//           percentage={Math.round((positiveCount / totalCount) * 100)}
//           color="bg-green-100" 
//           textColor="text-green-800"
//           onClick={() => setActiveTab('positive')}
//           active={activeTab === 'positive'}
//         />
//         <SentimentCard 
//           title="Neutral" 
//           count={neutralCount} 
//           percentage={Math.round((neutralCount / totalCount) * 100)}
//           color="bg-blue-100" 
//           textColor="text-blue-800"
//           onClick={() => setActiveTab('neutral')}
//           active={activeTab === 'neutral'}
//         />
//         <SentimentCard 
//           title="Negative" 
//           count={negativeCount} 
//           percentage={Math.round((negativeCount / totalCount) * 100)}
//           color="bg-red-100" 
//           textColor="text-red-800"
//           onClick={() => setActiveTab('negative')}
//           active={activeTab === 'negative'}
//         />
//       </div>

//       <div>
//         <h3 className="text-xl font-medium text-gray-800 mb-4">
//           {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Comments ({filteredResults.length})
//         </h3>
        
//         {filteredResults.length === 0 ? (
//           <p className="text-gray-500 italic py-4">No comments found in this category.</p>
//         ) : (
//           <div className="space-y-4">
//             {filteredResults.map((result, index) => (
//               <CommentCard key={index} result={result} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function SentimentCard({ title, count, percentage, color, textColor, onClick, active }) {
//   return (
//     <div 
//       className={`rounded-lg ${color} p-4 cursor-pointer transition-all ${active ? 'ring-2 ring-indigo-500 transform scale-105' : 'hover:shadow-md'}`}
//       onClick={onClick}
//     >
//       <h4 className={`font-medium ${textColor}`}>{title}</h4>
//       <div className="flex items-end justify-between">
//         <span className={`text-2xl font-bold ${textColor}`}>{count}</span>
//         {percentage !== undefined && (
//           <span className={`${textColor} opacity-80`}>{percentage}%</span>
//         )}
//       </div>
//     </div>
//   );
// }

// function CommentCard({ result }) {
//   const sentimentMap = {
//     0: { label: 'Negative', color: 'bg-red-100', textColor: 'text-red-800', barColor: 'bg-red-500' },
//     1: { label: 'Neutral', color: 'bg-blue-100', textColor: 'text-blue-800', barColor: 'bg-blue-500' },
//     2: { label: 'Positive', color: 'bg-green-100', textColor: 'text-green-800', barColor: 'bg-green-500' }
//   };
  
//   const sentiment = sentimentMap[result.sentiment_label];
  
//   const probabilities = result.sentiment_probabilities;
  
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="mb-3">
//         <p className="text-gray-800">{result.original_comment}</p>
//       </div>
      
//       <div className="flex items-center gap-3">
//         <span className={`px-2 py-1 rounded-full text-sm font-medium ${sentiment.color} ${sentiment.textColor}`}>
//           {sentiment.label}
//         </span>
        
//         <div className="flex-grow">
//           <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//             {probabilities.map((prob, i) => (
//               <div
//                 key={i}
//                 style={{ width: `${prob * 100}%` }}
//                 className={`h-full ${sentimentMap[i].barColor} float-left`}
//               ></div>
//             ))}
//           </div>
          
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>Negative: {Math.round(probabilities[0] * 100)}%</span>
//             <span>Neutral: {Math.round(probabilities[1] * 100)}%</span>
//             <span>Positive: {Math.round(probabilities[2] * 100)}%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;