import Image from "next/image";
import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";

export default function Home() {
  return (
    <Room>
      <CollaborativeApp />
    </Room>
  );
}
