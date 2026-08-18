import ErrorPage from './ErrorPage';

const ServiceUnavailable503 = () => {
  return <ErrorPage statusCode={503} />;
};

export default ServiceUnavailable503;
