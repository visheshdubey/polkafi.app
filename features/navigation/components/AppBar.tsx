import { Button } from "@/components/ui/button";

type Props = {};

const AppBar = (props: Props) => {
  return (
    <nav className="bg-white/20 backdrop-blur-md h-14 flex items-center px-4 lg:px-6 lg:rounded-full">
      <span className="text-[#4A3AFF] text-base font-semibold">Polka fi.</span>
      <Button
        size={"sm"}
        variant={"outline"}
        className="ml-auto bg-transparent shadow-none px-1.5 py-0.5"
      >
        Feedbacks
      </Button>
    </nav>
  );
};

export default AppBar;
