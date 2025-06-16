import type {User}from './userType'
export interface HeaderProps {
  user: User; // תחליפי ל-type מדויק יותר אם יש לך (למשל User או null)
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}