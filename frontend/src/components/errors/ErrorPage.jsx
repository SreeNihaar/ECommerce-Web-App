import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ statusCode = 404, title, message, details }) => {
  const navigate = useNavigate();

  const errorConfigs = {
    400: {
      title: 'Bad Request',
      message: 'The request could not be understood by the server.',
      details: 'Please check your request and try again.'
    },
    403: {
      title: 'Access Forbidden',
      message: 'You do not have permission to access this resource.',
      details: 'If you believe this is a mistake, please contact support.'
    },
    404: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist.',
      details: 'It might have been moved or deleted.'
    },
    500: {
      title: 'Internal Server Error',
      message: 'Something went wrong on our end.',
      details: 'Our team has been notified. Please try again later.'
    },
    503: {
      title: 'Service Unavailable',
      message: 'The server is temporarily unavailable.',
      details: 'We are working on fixing this issue. Please try again later.'
    }
  };

  const config = errorConfigs[statusCode] || errorConfigs[404];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displayDetails = details || config.details;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-purple-700 p-5">
      <div className="bg-white rounded-xl shadow-2xl p-12 text-center max-w-md w-full animate-fadeIn">
        <div className="text-8xl font-bold bg-linear-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-6">
          {statusCode}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {displayTitle}
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          {displayMessage}
        </p>

        <p className="text-sm text-gray-500 mb-8">
          {displayDetails}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-7 py-3 bg-linear-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all cursor-pointer"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-7 py-3 bg-blue-50 text-blue-600 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-400">
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
      `}</style>
    </div>
  );
};

export default ErrorPage;
