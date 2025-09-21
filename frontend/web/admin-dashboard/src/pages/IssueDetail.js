import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const IssueDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [issue, setIssue] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get(`/issue/${id}`).then((res) => setIssue(res.data.data));
    api.get(`/feedback/${id}`).then((res) => setFeedback(res.data.data));
  }, [id]);

  const handleFeedbackSubmit = () => {
    api.post(`/feedback/${id}`, { rating, comments: comment })
      .then((res) => {
        setFeedback([...feedback, res.data.data]);
        setRating(0);
        setComment('');
      });
  };

  if (!issue) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{issue.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><strong className="font-semibold">Category:</strong> {issue.category}</p>
        <p><strong className="font-semibold">Status:</strong> {issue.status}</p>
        <p><strong className="font-semibold">Address:</strong> {issue.address}</p>
        <p className="mt-4">{issue.description}</p>
        
        {/* Display Media */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Media:</h3>
          {issue.media.map(m => (
            <img key={m._id} src={m.fileUrl} alt="issue media" className="max-w-xs rounded" />
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Feedback</h2>
        {issue.status === 'resolved' && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="font-semibold mb-2">Leave your feedback</h3>
            <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRating(star)}>
                        <span className={rating >= star ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                    </button>
                ))}
            </div>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Your comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleFeedbackSubmit}
              className="bg-blue-600 text-white p-2 mt-2 rounded"
            >
              Submit Feedback
            </button>
          </div>
        )}
        <div className="space-y-4">
          {feedback.map(fb => (
            <div key={fb._id} className="bg-gray-50 p-3 rounded">
              <p className="font-semibold">{fb.userId.fullName} ({'★'.repeat(fb.rating)})</p>
              <p>{fb.comments}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;