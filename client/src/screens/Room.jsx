import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import ReactPlayer from 'react-player';

function RoomPage() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const handleUserJoin = useCallback(({ email, id }) => {
    console.log(email, id);
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    socket.on('user:join', handleUserJoin);
    return () => {
      socket.off('user:join', handleUserJoin);
    };
  }, [socket, handleUserJoin]);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    } catch (error) {
      if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError'
      ) {
        // Handle the case where the requested device is not found
        console.error('Requested device not found');
      } else if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        // Handle the case where the user denies permission
        console.error('User denied permission');
      } else {
        // Handle other errors
        console.error('Error accessing media devices:', error.message);
      }
    }
  }, []);

  return (
    <div>
      Room
      <div>
        <h3>{remoteSocketId ? 'Connected' : 'No one in Room'}</h3>
        {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
        {myStream && (
          <>
            <h1>My Stream</h1>
            <ReactPlayer
              playing
              muted
              height="100px"
              width="200px"
              url={myStream}
            />
          </>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default RoomPage;
