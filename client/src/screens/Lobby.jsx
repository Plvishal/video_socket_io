import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';
function Lobby() {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit('room:join', { email, room });
    },
    [email, room, socket]
  );
  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      console.log(email, room);

      navigate(`/room/${room}`);
    },
    [navigate]
  );
  useEffect(() => {
    socket.on('room:join', handleJoinRoom);
    return () => {
      socket.off('room:join', handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailId">Email ID</label>
        <input
          type="email"
          name="emailId"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <label htmlFor="room_num">Room Number</label>
        <input
          type="text"
          name="room_num"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
}

export default Lobby;
