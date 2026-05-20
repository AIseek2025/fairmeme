import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { create } from 'zustand';

interface AuthState {
    authStatus: AuthenticationStatus;
    setAuthStatus: (status: AuthenticationStatus) => void;
}

const useAuthStatusStore = create<AuthState>((set) => ({
    authStatus: 'unauthenticated',
    setAuthStatus: (status: AuthenticationStatus) => {
        // console.log(`Auth status set to: ${status}`);
        set({ authStatus: status });
    },
}));

export default useAuthStatusStore;
