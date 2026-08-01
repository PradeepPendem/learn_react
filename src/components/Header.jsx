import { useState } from 'react';
import UserCard from './UserCard.jsx';
import './../styles/Header.css';
const users = [
  {
    id: 1,
    name: 'Pradeep',
    email: 'p@example.com',
    company: 'InvoiceCloud',
    role: 'Frontend Developer',
  },
  {
    id: 2,
    name: 'Mouni',
    email: 'm@example.com',
    company: 'InvoiceCloud',
    role: 'Dietician',
  },
  {
    id: 3,
    name: 'Uttej',
    email: 'U@example.com',
    company: 'InvoiceCloud',
    role: 'Digital Marketing',
  },
];
function Header() {
  const [searchVal, setSearch] = useState('');

  const filteredUsers = users.filter((user) => {
    let searchV = searchVal.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchV) ||
      user.email.toLowerCase().includes(searchV) ||
      user.role.toLowerCase().includes(searchV)
    );
  });

  return (
    <div>
      {/* <nav class="navbar">
        <div class="logo">IC</div>
        <h1 class="title">Invoice Dashboard</h1>
        <button class="logout">Log Out (pradeep@example.com)</button>
      </nav> */}
      <input
        value={searchVal}
        className="searchInput"
        placeholder="Enter Value"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      ></input>
      <div className="cardsList">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} userdetails={user}></UserCard>
        ))}
      </div>
    </div>
  );
}

export default Header;
