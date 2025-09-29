import React from 'react';
import {
  FaSearch as FaSearchIcon,
  FaFilter as FaFilterIcon,
  FaSortUp as FaSortAscendingIcon,
  FaComment as FaChatIcon,
  FaUser as FaUserIcon,
  FaRegClock as FaClockIcon,
  FaCheck as FaCheckIcon,
  FaTimes as FaXIcon,
  FaEnvelope as FaMailIcon,
  FaPhone as FaPhoneIcon,
  FaTrash as FaTrashIcon,
} from 'react-icons/fa';

const ResolveQueries = () => {
  const queryStatus = [
    { id: 1, name: 'All', count: 123 },
    { id: 2, name: 'Unread', count: 45 },
    { id: 3, name: 'In Progress', count: 32 },
    { id: 4, name: 'Resolved', count: 46 },
  ];

  const queryTypes = [
    { id: 1, name: 'All', count: 123 },
    { id: 2, name: 'Technical Support', count: 56 },
    { id: 3, name: 'Payment Issues', count: 23 },
    { id: 4, name: 'Account Issues', count: 21 },
    { id: 5, name: 'Project Disputes', count: 23 },
  ];

  const queries = [
    {
      id: 1,
      date: '2025-05-01',
      user: 'John Doe',
      type: 'Technical Support',
      status: 'Unread',
      priority: 'High',
      subject: 'Cannot access my account',
      lastResponse: '10 minutes ago',
      messages: 2,
    },
    {
      id: 2,
      date: '2025-04-30',
      user: 'Jane Smith',
      type: 'Payment Issues',
      status: 'In Progress',
      priority: 'Medium',
      subject: 'Payment not received',
      lastResponse: '1 hour ago',
      messages: 5,
    },
    // Add more sample queries
  ];

  return (
    <div className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Resolve Queries</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Search queries..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center">
          <FaFilterIcon className="inline-block mr-2" />
          Filter
        </button>
        <button className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center">
          <FaSortAscendingIcon className="inline-block mr-2" />
          Sort
        </button>
      </div>

      {/* Query Status and Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Query Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {queryStatus.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>{status.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status.name === 'Unread'
                    ? 'bg-red-100 text-red-800'
                    : status.name === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : status.name === 'Resolved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Query Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {queryTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>{type.name}</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {type.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-left">User</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Priority</th>
                <th className="py-3 text-left">Subject</th>
                <th className="py-3 text-left">Last Response</th>
                <th className="py-3 text-left">Messages</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query.id} className="border-b">
                  <td className="py-4">{query.date}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <FaUserIcon className="w-5 h-5 text-gray-400" />
                      <span>{query.user}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {query.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      query.status === 'Unread'
                        ? 'bg-red-100 text-red-800'
                        : query.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : query.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {query.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      query.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : query.priority === 'Medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {query.priority}
                    </span>
                  </td>
                  <td className="py-4 break-words max-w-[180px]">{query.subject}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <FaClockIcon className="w-5 h-5 text-gray-400" />
                      <span>{query.lastResponse}</span>
                    </div>
                  </td>
                  <td className="py-4 font-medium">{query.messages}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="text-blue-500 hover:text-blue-600" title="Chat">
                        <FaChatIcon className="w-5 h-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-600" title="Mark Resolved">
                        <FaCheckIcon className="w-5 h-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-600" title="Close">
                        <FaXIcon className="w-5 h-5" />
                      </button>
                      <button className="text-blue-500 hover:text-blue-600" title="Mail">
                        <FaMailIcon className="w-5 h-5" />
                      </button>
                      <button className="text-purple-500 hover:text-purple-600" title="Call">
                        <FaPhoneIcon className="w-5 h-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-600" title="Delete">
                        <FaTrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResolveQueries;