import io from "socket.io-client";
import URL from "./Store/URL";

const socket = io(URL);
export default socket;
