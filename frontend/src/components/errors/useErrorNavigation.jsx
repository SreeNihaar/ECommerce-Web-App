import { useNavigate } from 'react-router-dom';

const useErrorNavigation = () => {
  const navigate = useNavigate();

  const goToError = (statusCode) => {
    navigate(`/error/${statusCode}`);
  };

  const go400 = () => goToError(400);
  const go403 = () => goToError(403);
  const go404 = () => goToError(404);
  const go500 = () => goToError(500);
  const go503 = () => goToError(503);

  return {
    goToError,
    go400,
    go403,
    go404,
    go500,
    go503,
  };
};

export default useErrorNavigation;
