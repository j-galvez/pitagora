import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDocumentTitle, getPageTitle } from '../utils/pageTitles';

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = formatDocumentTitle(getPageTitle(pathname));
  }, [pathname]);

  return null;
}
