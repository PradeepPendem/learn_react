import { useState, useEffect } from 'react';
import UserCard from './UserCard.jsx';

function User() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    console.log(data.count);
    setUsers(data);
  }

  return (
    <div className="cardsList">
      {users.map((usr) => (
        <UserCard key={usr.id} userdetails={usr}></UserCard>
      ))}
    </div>
  );
}

export default User;
