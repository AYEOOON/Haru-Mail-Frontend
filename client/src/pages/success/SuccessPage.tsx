// src/pages/SuccessPage/SuccessPage.tsx
import React, { useEffect, useState } from 'react';

interface UserInfo {
  email: string;
  username: string;
}

const SuccessPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + getAccessTokenFromCookies(),
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data: UserInfo) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error fetching user info:', err);
      });
  }, []);

  const getAccessTokenFromCookies = (): string => {
    const name = 'accessToken=';
    const decoded = decodeURIComponent(document.cookie);
    return decoded
      .split('; ')
      .find((row) => row.startsWith(name))
      ?.substring(name.length) ?? '';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default SuccessPage;
