import './../styles/UserCard.css';

function userCard({ userdetails }) {
  return (
    <div className="card">
      <div>{userdetails.name}</div>
      {/* <div>{userdetails.role}</div> */}
      <div>{userdetails.email}</div>
      {/* <div>{userdetails.company}</div> */}
    </div>
  );
}

export default userCard;
