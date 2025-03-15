// app/feedback/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim() === "" && rating === 0) {
      toast(
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="warning emoji" className="text-xl">
            ⚠️
          </span>
          <p>Please submit both feedback and rating.</p>
        </div>,
        { 
          style: {
            backgroundColor: "#FEF3C7", 
            color: "#92400E", 
            border: "1px solid #F59E0B", 
          },
          duration: 2000, 
        }
      );
      return;
    }

    if (feedback.trim() === "" && rating !== 0) {
      toast(
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="warning emoji" className="text-xl">
            ⚠️
          </span>
          <p>Please write some feedback.</p>
        </div>,
        { 
          style: {
            backgroundColor: "#FEF3C7", 
            color: "#92400E", 
            border: "1px solid #F59E0B", 
          },
          duration: 2000,
        }
      );
      setRating(0);
      return;
    }

    if (feedback.trim() !== "" && rating === 0) {
      toast(
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="warning emoji" className="text-xl">
            ⚠️
          </span>
          <p>Please select a rating.</p>
        </div>,
        { 
          style: {
            backgroundColor: "#FEF3C7", 
            color: "#92400E", 
            border: "1px solid #F59E0B", 
          },
          duration: 2000,
        }
      );
      setFeedback("");
      return;
    }

    toast(
      <div className="flex items-center space-x-2">
        <span role="img" aria-label="thank you emoji" className="text-xl">
          🙏
        </span>
        <p>Thank you for your feedback!</p>
      </div>,
      { duration: 2000 } 
    );

    setFeedback("");
    setRating(0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative mb-8">
        <button className="flex items-center justify-between w-64 px-4 py-2 border rounded-xl shadow-sm bg-white">
          <span>Options</span>
          <span>▼</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-md shadow-sm border">
        <h2 className="text-4xl font-normal mb-6">Feedback</h2>

        <div className="mb-6 relative">
          <label className="absolute -top-3 left-4 px-1 bg-white text-lg font-medium z-10">
            Write Feedback
          </label>
          <textarea
            className={`w-full p-4 pt-6 rounded h-36 transition-colors duration-200 ${
              isFocused
                ? "border-2 border-black text-black"
                : "border border-[#a0a9be] text-[#A0A9BE]"
            }`}
            placeholder="Write..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {/* Rating Section */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <span className="mr-6 text-lg">Give Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="mx-2"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={rating >= star ? "gold" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            className="hover:cursor-pointer px-8 py-2 text-base"
            onClick={handleSubmit}
          >
            Done
          </Button>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default FeedbackPage;