import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigationState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Store intended destination
  const saveIntendedDestination = (path: string) => {
    sessionStorage.setItem('intendedDestination', path);
  };
  
  // Get and clear intended destination
  const getAndClearIntendedDestination = () => {
    const destination = sessionStorage.getItem('intendedDestination');
    sessionStorage.removeItem('intendedDestination');
    return destination;
  };
  
  return {
    saveIntendedDestination,
    getAndClearIntendedDestination,
    currentPath: location.pathname,
    navigate
  };
}; 