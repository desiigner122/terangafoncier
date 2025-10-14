import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessionAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session) {
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        };

        fetchSessionAndProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                if (session) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, avatar_url, role`)
                .eq('id', userId)
                .single();

            if (error && status !== 406) {
                console.error('Error fetching profile:', error.message);
                return;
            }

            if (data) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Catastrophic error fetching profile:', error.message);
        }
    };

    const value = {
        supabase,
        session,
        user: session?.user,
        profile,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
