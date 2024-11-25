import Image from "next/image";

type Props = {};

const BackgroundGradient = (props: Props) => {
  return (
    <div className="fixed h-screen z-0 opacity-[0.20] top-0 left-0 w-full flex items-center justify-center">
      <Image
        src={"/assets/bg-gradient.svg"}
        alt="background gradient"
        width={540}
        height={540}
        className=""
      />
    </div>
  );
};

export default BackgroundGradient;
