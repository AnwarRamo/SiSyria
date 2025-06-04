import React from 'react';

function SocialMedia() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Social Media Overview</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Followers Stats */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Followers Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <i className="fab fa-youtube mr-2 text-red-600"></i>
              <div>
                <p className="font-bold">2,344</p>
                <p className="text-gray-600">Subscribers</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fab fa-instagram mr-2 text-purple-600"></i>
              <div>
                <p className="font-bold">1,283</p>
                <p className="text-gray-600">Followers</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fab fa-linkedin mr-2 text-blue-700"></i>
              <div>
                <p className="font-bold">1,283</p>
                <p className="text-gray-600">Following</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fab fa-google-plus-g mr-2 text-red-600"></i>
              <div>
                <p className="font-bold">1,004</p>
                <p className="text-gray-600">Circled by</p>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Shares */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">LinkedIn Shares</h3>
          <div className="flex justify-between">
            <p className="font-bold">155</p>
            <p className="text-gray-600">Shares last month</p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="font-bold">18%</p>
            <p className="text-gray-600">Vs 131 prev month</p>
          </div>
        </div>

        {/* Facebook Page Likes */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">Facebook Page Likes</h3>
          <div className="flex justify-between">
            <p className="font-bold">Total page Likes: 2,344</p>
            <p className="text-gray-600">Vs 11,793</p>
          </div>
          <div className="flex justify-between mt-1">
            <p className="font-bold">New page Likes: 432</p>
            <p className="text-gray-600">Vs 321</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialMedia;