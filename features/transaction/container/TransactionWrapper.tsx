import { ChevronDown, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chart } from "../components/chart";

type Props = {};

const TransactionWrapper = (props: Props) => {
  return (
    <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
      <div className="flex flex-wrap items-baseline w-full gap-2 mt-3 lg:mt-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Button
          size={"sm"}
          variant={"link"}
          className="rounded-full mb-1 px-2 text-neutral-700 "
        >
          24 Oct - 24 Nov, 2024
        </Button>
      </div>

      <div className="w-full flex items-center p-3 lg:p-6 gap-6 overflow-x-auto rounded-xl glass-card-gradient">
        <div className="bg-white rounded-xl grow h-44">
          <Chart></Chart>
        </div>
        <div className="bg-white rounded-xl grow h-44">
          {" "}
          <Chart></Chart>
        </div>
        <div className="bg-white rounded-xl grow h-44">
          {" "}
          <Chart></Chart>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="items-center flex gap-3 lg:gap-6">
          <Button
            size={"sm"}
            variant={"outline"}
            className="items-center rounded-full"
          >
            Select Category
            <ChevronDown />
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="items-center rounded-full"
          >
            Select Type
            <ChevronDown />
          </Button>
        </div>{" "}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            size={"sm"}
            variant={"outline"}
            className="bg-transparent rounded-full"
          >
            <Plus /> New Category
          </Button>
          <Button size={"sm"} className="rounded-full">
            <Plus /> New Transaction
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col *:border-b *:border-neutral-100 last-of-type:border-b-0 rounded-xl overflow-hidden bg-white">
        {Array(12)
          .fill(null)
          .map((item) => {
            return (
              <div className="bg-white flex justify-between items-center lg:items-end gap-2 w-full p-3 lg:p-4">
                <div className="flex flex-col gap-1 lg:gap-2">
                  <span className="text-[11px] text-neutral-400">
                    TRXN-1234
                  </span>
                  <div className="flex items-center flex-wrap gap-3  lg:gap-6">
                    <div className="text-base/[120%] lg:text-lg font-medium text-neutral-800">
                      Purchased a car for 10000rs
                    </div>
                    <div className="flex *:rounded-full items-center flex-wrap gap-2">
                      <Badge variant="secondary" className="font-normal">
                        Vehicle
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        24 Nov, 2024
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="font-normal text-green-800 bg-green-600/10"
                      >
                        Credit
                      </Badge>
                    </div>
                  </div>
                </div>
                <span className="text-green-700 text-lg font-bold">
                  $20,456
                </span>
              </div>
            );
          })}
      </div>
      <Button
        size={"icon"}
        className="lg:hidden fixed size-12 z-50 bottom-4 right-4 rounded-full"
      >
        <Plus className="text-xl"></Plus>
      </Button>
    </div>
  );
};

export default TransactionWrapper;
