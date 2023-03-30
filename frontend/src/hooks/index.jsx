import { useContext } from 'react';

import ApiContext from './ApiContextProvider';
import AuthContext from './AuthContextProvider';

export const useAuth = () => useContext(AuthContext);

export const useApi = () => useContext(ApiContext);
