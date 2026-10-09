'use client';

import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'employee';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  initials: string;
  avatarGradient: string;
}

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-1',
  name: 'Alex Yadao',
  email: 'a.yadao@opsflow.internal',
  role: 'admin',
  roleTitle: 'Lead SysAdmin',
  department: 'IT Infrastructure & SecOps',
  initials: 'AY',
  avatarGradient: 'from-blue-700 via-indigo-600 to-slate-900',
};

export const EMPLOYEE_USER: UserProfile = {
  id: 'usr-emp-1',
  name: 'Taylor Morgan',
  email: 't.morgan@opsflow.internal',
  role: 'employee',
  roleTitle: 'Employee (Requester)',
  department: 'Product Marketing',
  initials: 'TM',
  avatarGradient: 'from-violet-600 via-purple-600 to-indigo-900',
};

interface RoleContextType {
  role: UserRole;
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRole = sessionStorage.getItem('opsflow_demo_role') as UserRole | null;
        if (savedRole === 'admin' || savedRole === 'employee') {
          return savedRole;
        }
      } catch {
        // Ignore
      }
    }
    return 'admin';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('opsflow_demo_role', newRole);
      } catch {
        // Ignore
      }
    }
  };

  const toggleRole = () => {
    setRole(role === 'admin' ? 'employee' : 'admin');
  };

  const currentUser = role === 'admin' ? ADMIN_USER : EMPLOYEE_USER;

  return (
    <RoleContext.Provider
      value={{
        role,
        currentUser,
        setRole,
        toggleRole,
        isAdmin: role === 'admin',
        isEmployee: role === 'employee',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
