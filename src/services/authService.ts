interface User {
  username: string;
  password: string;
}

const users: User[] = [
  { username: 'admin', password: 'admin123' }
];

export const login = (username: string, password: string): Promise<boolean> => {
  const user = users.find(u => u.username === username && u.password === password);
  return Promise.resolve(!!user);
};