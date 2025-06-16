// 🧾 תבנית שמייצגת את UserDto מהשרת (C#)
export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userPassword: string;
}
export interface UserForHomePage {
  username: string;
  profileImage: string | null; // כי יכול להיות null מ־localStorage
}
export // טיפוס של סטייט
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}