import Dropzone from "./components/Dropzone";

export default function Home() {
  return (
    <div className="flex container justify-center ">
      <h1 className="text-xl font-bold underline mt-10">Upload files</h1>
      <div className="flex justify-center items-center py-24">
        <Dropzone />
      </div>
    </div>
  );
}
